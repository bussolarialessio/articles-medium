# Laya Compaction: inspect what would stay

Companion to **Laya Compaction: What Should Stay in an Agent's Context?** (unpublished).

Node 24.19.0, `@bussolabs/laya-compaction` 0.1.2 (MIT). Alessio's Laya adaptation builds on `tamaratran/fast-jev-compaction`. Laya is an upstream decision model, not authored here.

```sh
mise install
npm ci --ignore-scripts
npm test
```

Start the training guide's server with the compaction checkpoint on port 18766, then `npm run demo`. It reads this actual README and puts its result in an explicitly constructed teaching transcript. The six follow-up messages are illustrative, not a real agent session. The model request and read are real. Inspect `decisions`, `messages` and `stats`; there is no promised reduction.

The default first message and newest six messages are pinned. Threshold 0.5: retaining a result retains its call too; retaining only a call shortens its result; retaining neither removes the pair. Ordinary message text remains verbatim. Results are omitted from the decision state, so the model is judging usefulness from context and metadata, not inspecting all content it might discard.

This demo only prints a candidate transcript. It never edits live agent history or installs hooks. A smaller transcript is not proof that subsequent task quality survives. Compare task completion, re-reads, failures and discarded evidence before enabling hooks. Server-reported truncation is rejected by the library.

Source: https://github.com/bussolabs/laya-compaction/tree/129be2511991374dd54218fd6d7d30686c6eaf31
