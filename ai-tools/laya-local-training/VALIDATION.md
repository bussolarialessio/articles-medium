# Local validation record

Executed on 2026-10-14 with Python 3.12.13, Laya 0.4.0 and Apple Silicon MPS. This is execution evidence, not a model-quality benchmark.

- Three preparation tests pass: duplicate states stay together, insufficient distinct states fail, unlabelled input fails.
- Router download: 30 rows, split 24/6; dry run yields 96 training items and 24 evaluation items, no skips.
- Compaction download: 16 rows, split 13/3; dry run yields 58 training items and 16 evaluation items, no skips.
- Both smoke runs complete one epoch on two items with encoder frozen, max_len 4096, micro-batch 1 and accumulation 1. Both save checkpoints and reload for prediction.
- Both reports have zero evaluation items and `is_held_out: false`. There is no generalization metric.
- The compaction schema warning is expected: repeated question IDs have different instructions. Inference passes the current questions explicitly.
- Both checkpoints served successfully on dedicated loopback ports 18765 and 18766. The router demo received a prediction and selected haiku without input truncation. The compaction demo made one model request and kept its one eligible pair: 1792 characters before and after in that run. No reduction was measured.
- Both temporary server processes were stopped after verification. Existing CLI settings, hooks and other servers were not changed.

See [validation.json](validation.json) for source hashes and report fields. These are single runs on teaching inputs. The complete four-epoch/two-epoch training recipes, CPU/CUDA execution, real coding CLI workflows and production accuracy were not tested.

An initial 256-token smoke configuration truncated the router request. The final checked recipes use 4096 tokens; both smoke checkpoints were retrained and the demos repeated. The router demo now rejects truncation explicitly, an additional guard beyond the upstream 0.1.2 wrapper. Final router usage reports `truncated: false`.
