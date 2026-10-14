# Laya Router: prediction and policy

Companion to **Laya Router: Choosing a Model Before the Work** (unpublished).

Node 24.19.0. This imports the actual MIT-licensed `@bussolabs/laya-router` 0.1.2 policy, not a rewritten approximation. The project adapts `gargpratyush/jev-router`; Laya itself is by Convai Innovations.

```sh
mise install
npm ci --ignore-scripts
npm test
```

Five tests cover failure, confidence 0.29/0.30, context 20000/20001 and explicit override. Inputs are deliberate boundary-test cases, not measured model outputs.

For a real local model request, follow `../laya-local-training/README.md`, start its loopback server on 18765, then:

```sh
npm run demo -- 'Fix a spelling mistake in the README'
```

The demo calls Laya and prints the prediction plus final policy decision. It **does not run a coding CLI or spend coding-provider credits**. A timeout prints the keep-current fallback and exits with status 1 so it cannot be mistaken for successful inference. Predictions vary; there is no promised model choice. The model IDs are the package's catalog entries, not verified access on your account. A real wrapper must discover available models and fit the context.

Local routing does not make a cloud coding model local. Full CLI use still sends the conversation to the selected provider. This example uses an explicit separate local server and never changes Claude/Codex settings.

Sources: https://github.com/bussolabs/laya-router/tree/139b1cf8a40d3447e167f4979549d542c59d3f60 and https://github.com/gargpratyush/jev-router

The demo also rejects server-reported truncation before applying policy. This explicit teaching guard is additional to the upstream 0.1.2 routing wrapper.
