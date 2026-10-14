"""Serve one checkpoint on loopback; leave existing servers untouched."""
import argparse
import os
import uvicorn
from laya.serve import build_router, create_app

parser = argparse.ArgumentParser()
parser.add_argument("--checkpoint", required=True)
parser.add_argument("--port", type=int, default=18765)
args = parser.parse_args()
os.environ["LAYA_PRELOAD"] = "0"
router = build_router()
router.register("multilingual", os.path.abspath(args.checkpoint))
router.preload(["multilingual"])
router.predict("Warm up the local model", {"q": {"type": "noul", "instructions": "Is this a warm-up?"}}, model="multilingual")
uvicorn.run(create_app(router), host="127.0.0.1", port=args.port)
