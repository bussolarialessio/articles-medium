# Try a clean clone

Companion to **It Works Here. Try It from a Clean Clone.** (unpublished).

Node 24.19.0 and Git. No package dependencies. `config.json` is public example data, deliberately tracked.

```sh
mise install
mise exec -- node app.mjs
mise exec -- node verify.mjs
```

Expected: greeting, then PASS. The verifier clones **committed HEAD**, not your working tree or remote, into its own temporary directory and removes that directory afterward. Before the first commit it should fail because the example does not exist in HEAD.

To reproduce the failure safely: in a disposable repository, untrack `config.json` while keeping it on disk, commit its removal there, then run the app (passes) and verifier (fails).

A local clone shares the machine's OS and Node runtime; it proves file completeness, not portability or a fresh dependency cache. Run in CI on the target OS for extra evidence.

Source: https://git-scm.com/docs/git-clone

## Automated reproduction

`mise exec -- npm test` creates its own disposable Git repository, verifies the complete committed example, untracks only its temporary configuration, and confirms that the original still runs while the fresh clone fails. It removes its own directory afterward. It does not commit or change files in your repository.
