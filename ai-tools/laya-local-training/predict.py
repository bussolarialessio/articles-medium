"""Load a saved checkpoint and predict one explicitly selected example."""
import argparse
import json
from pathlib import Path
import laya

parser = argparse.ArgumentParser()
parser.add_argument("checkpoint")
parser.add_argument("data", type=Path)
args = parser.parse_args()
row = json.loads(args.data.read_text().splitlines()[0])
agent = laya.load(args.checkpoint)
result = agent.predict(row["state"], row["questions"])
print(json.dumps(result, indent=2))
