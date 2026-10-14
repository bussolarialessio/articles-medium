"""Fetch public teaching examples; split complete states before training."""
import argparse
import hashlib
import json
import random
from pathlib import Path
from urllib.request import urlopen

SOURCES = {
    "router": ("laya-router", "139b1cf8a40d3447e167f4979549d542c59d3f60"),
    "compaction": ("laya-compaction", "129be2511991374dd54218fd6d7d30686c6eaf31"),
}


def split_rows(rows, seed=42):
    groups = {}
    for row in rows:
        if not row.get("questions") or not (row.get("gold") or row.get("expected")):
            raise ValueError("Each row needs questions and labels")
        key = json.dumps(row["state"], sort_keys=True, ensure_ascii=False)
        groups.setdefault(key, []).append(row)
    keys = sorted(groups)
    if len(keys) < 3:
        raise ValueError("At least three distinct states are required")
    random.Random(seed).shuffle(keys)
    count = max(1, len(keys) // 5)
    evaluation = [row for key in keys[:count] for row in groups[key]]
    training = [row for key in keys[count:] for row in groups[key]]
    return training, evaluation


def prepare(task, output):
    repo, revision = SOURCES[task]
    base = f"https://raw.githubusercontent.com/bussolabs/{repo}/{revision}"
    with urlopen(f"{base}/tuning/examples.jsonl", timeout=60) as response:
        raw = response.read()
    rows = [json.loads(line) for line in raw.decode().splitlines() if line.strip()]
    train, evaluation = split_rows(rows)
    output.mkdir(parents=True, exist_ok=False)
    for name, subset in [("train", train), ("eval", evaluation)]:
        (output / f"{name}.jsonl").write_text("".join(json.dumps(row) + "\n" for row in subset))
    # This is intentionally a small, non-held-out execution check.
    smoke = [dict(row, questions={next(iter(row["questions"])): next(iter(row["questions"].values()))}) for row in train[:2]]
    (output / "smoke.jsonl").write_text("".join(json.dumps(row) + "\n" for row in smoke))
    with urlopen(f"{base}/LICENSE", timeout=60) as response:
        (output / "UPSTREAM-LICENSE").write_bytes(response.read())
    manifest = {"task": task, "repository": f"https://github.com/bussolabs/{repo}",
                "revision": revision, "sha256": hashlib.sha256(raw).hexdigest(),
                "source_rows": len(rows), "train_rows": len(train), "eval_rows": len(evaluation),
                "seed": 42, "purpose": "Public teaching examples, not a production benchmark"}
    (output / "source.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("task", choices=SOURCES)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    prepare(args.task, args.out)
