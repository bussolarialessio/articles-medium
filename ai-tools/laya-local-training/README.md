# Fine-tune Laya locally

Companion to **Fine-Tuning Laya Locally: From Labelled Examples to a Checkpoint** (unpublished draft). This trains the Laya decision model, not a coding LLM. Laya is by Convai Innovations. Alessio's integrations adapt Jev Router and Fast Jev Compaction; see the upstream licenses downloaded with the examples.

## 1. Environment

Tested on Apple Silicon macOS with 64 GiB unified memory, Python 3.12.13, uv 0.11.28 and Laya 0.4.0. The memory figure describes the test machine, not a minimum. CPU and CUDA recipes have not been executed here. Initial package and model downloads require network access and disk space. Training uses local compute; no paid model API is called.

```sh
mise install
mise exec -- uv venv --python 3.12.13
mise exec -- uv pip sync requirements.txt
.venv/bin/python -m unittest -v
```

The resolved requirements were generated on macOS; CUDA installations may require a platform-specific PyTorch distribution. Check the official PyTorch installation selector before adapting this lockfile. Do not mix this environment with a project's unrelated ML dependencies.

## 2. Download versioned teaching data

```sh
.venv/bin/python prepare.py router --out data/router
.venv/bin/python prepare.py compaction --out data/compaction
```

The script refuses to overwrite an existing destination. Use a new output directory for another preparation run. Downloads are public, with no credentials required.

- Router: revision `139b1cf8a40d3447e167f4979549d542c59d3f60`, 30 rows, split 24/6.
- Compaction: revision `129be2511991374dd54218fd6d7d30686c6eaf31`, 16 rows, split 13/3.

`source.json` records the exact SHA-256, revision and seed. `UPSTREAM-LICENSE` accompanies downloaded data. The teaching examples are synthetic upstream examples, not real production measurements. Nothing from local unpublished training datasets is copied.

Rows have `state`, `questions`, and `gold` or `expected`. Choice labels must match criterion keys exactly; noul labels are booleans; score labels identify scale levels. The public router uses exact model IDs, not the newer unpublished tier-only format.

Exact duplicate states stay together during splitting. This does not detect related sessions or paraphrases. With real data, group by session/project/source before splitting, review labels manually, and reserve a final test set that is never used for threshold or hyperparameter selection. Remove credentials and obtain permission to use conversation data.

## 3. Validate preprocessing

```sh
.venv/bin/laya-train --data data/router/train.jsonl --eval data/router/eval.jsonl --base multilingual --max-len 4096 --dry-run
.venv/bin/laya-train --data data/compaction/train.jsonl --eval data/compaction/eval.jsonl --base multilingual --max-len 4096 --dry-run
```

A dry run checks preprocessing, not training or saving. Examine skipped labels. A row contains several questions, so item counts exceed row counts.

## 4. Small execution checks

These commands were actually executed. They intentionally use two states and one question per state, freeze the encoder, and keep a 4096-token context window. The router smoke uses its first score question, not the full routing question set. **These are pipeline checks, not deployable fine-tunes or accuracy experiments.**

```sh
.venv/bin/laya-train --data data/router/smoke.jsonl --base multilingual --out checkpoints/router-smoke --epochs 1 --micro-batch 1 --grad-accum 1 --freeze-encoder --max-len 4096 --device mps --seed 42
.venv/bin/python predict.py checkpoints/router-smoke data/router/smoke.jsonl
.venv/bin/laya-train --data data/compaction/smoke.jsonl --base multilingual --out checkpoints/compaction-smoke --epochs 1 --micro-batch 1 --grad-accum 1 --freeze-encoder --max-len 4096 --device mps --seed 42
.venv/bin/python predict.py checkpoints/compaction-smoke data/compaction/smoke.jsonl
```

Select `--device cpu`, `mps` or `cuda` for your hardware. Use a new checkpoint output directory for a new experiment. Both smoke reports have `is_held_out: false` and `eval_items: 0`. The warning about no calibration/evaluation items is expected. Do not turn training loss into a claimed generalization metric.

Compaction's repeated question IDs have different instructions. Laya 0.4.0 warns that the saved `questions.json` retains the first definition. `predict.py` and the HTTP clients pass each request's actual questions, so they do not rely on that file as a universal schema.

## 5. Complete teaching-set recipes

The following longer runs are starting recipes, **not runs claimed as completed in this session**. They unfreeze the encoder. Resource requirements differ substantially from the smoke checks. Adjust accumulation and sequence length based on measured memory; shortening context changes what the model can learn.

```sh
.venv/bin/laya-train --data data/router/train.jsonl --eval data/router/eval.jsonl --base multilingual --out checkpoints/router-v1 --epochs 4 --micro-batch 1 --grad-accum 16 --loss rlcd --shuffle-options --max-len 4096 --device mps --seed 42
.venv/bin/laya-train --data data/compaction/train.jsonl --eval data/compaction/eval.jsonl --base multilingual --out checkpoints/compaction-v1 --epochs 2 --micro-batch 1 --grad-accum 16 --loss rlcd --max-len 4096 --device mps --seed 42
```

Inspect each `train_report.json`: `is_held_out`, `eval_mode`, `eval_items`, overlap notes and skipped examples. Separate metrics by question type; a pooled score can conceal poor model choices or unsafe compaction. Six and three held-out rows are too few for production claims even without overlap. Compare base and tuned checkpoints on the same untouched cases, including long-context inputs, under-routing, indispensable results and unavailable models.

## 6. Serve and exercise the integration

In separate terminals, from this directory:

```sh
.venv/bin/python serve.py --checkpoint checkpoints/router-smoke --port 18765
```

```sh
.venv/bin/python serve.py --checkpoint checkpoints/compaction-smoke --port 18766
```

These listen only on `127.0.0.1`, warm the model and register it under `multilingual` for compatibility. They run in the foreground; stop your own process with Ctrl-C. If a port is occupied, pick another and update the corresponding demo endpoint. No existing Laya server, CLI settings or hooks are modified.

Then run `npm run demo` in `../laya-router` and `../laya-compaction`. Each prints actual responses. The router demo reports a failed inference with a nonzero exit code even though policy safely keeps the current model. The compaction demo prints a proposed transcript without changing live history. Both demos reject server-reported truncation; the compaction client explicitly requests 4096 tokens.

For evaluating a real fine-tune, replace the smoke paths with the reviewed checkpoints produced in step 5. Do not enable a live integration merely because an HTTP request succeeded. Local routing/compaction does not make a cloud coding provider local.

## Evidence and sources

See [VALIDATION.md](VALIDATION.md) for what ran. Datasets, checkpoints, logs and virtual environments are ignored by Git. No model weights or private training records are published with the examples.

- https://pypi.org/project/laya/0.4.0/
- https://github.com/NandhaKishorM/laya/blob/432312b36714d8889eba405507b37eda25257d9c/docs/finetune.md (later documentation; commands were checked against installed 0.4.0 `--help` and source)
- https://github.com/bussolabs/laya-router/tree/139b1cf8a40d3447e167f4979549d542c59d3f60
- https://github.com/bussolabs/laya-compaction/tree/129be2511991374dd54218fd6d7d30686c6eaf31
- https://pytorch.org/get-started/locally/
