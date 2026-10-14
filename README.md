# articles-medium

Runnable code examples accompanying [Alessio Bussolari's Medium articles](https://blog.bussolarialessio.me).

## Examples

Local draft examples prepared on 2026-10-14; article publication links are pending.

- [Rails Tests That Pass Alone and Fail Together](ruby-rails/order-dependent-tests/README.md)
- [The Tests Passed. Did the AI Change What They Prove?](ai-tools/tests-that-keep-their-promise/README.md)
- [It Works Here. Try It from a Clean Clone.](developer-workflow/clean-clone/README.md)
- [The Events Arrived. In the Wrong Order.](one-possible-fix/events-out-of-order/README.md)
- [Laya Router: Choosing a Model Before the Work](ai-tools/laya-router/README.md)
- [Laya Compaction: What Should Stay in an Agent’s Context?](ai-tools/laya-compaction/README.md)
- [Fine-Tuning Laya Locally: From Labelled Examples to a Checkpoint](ai-tools/laya-local-training/README.md)

## Organization

Each example belongs in `<series>/<example-slug>/`. Series identifiers match the editorial archive: `ruby-rails`, `ai-tools`, `developer-workflow`, `one-possible-fix`, and `dev-life-diaries`.

Create directories only when they contain a real example. Several articles may refer to the same example when they develop the same idea.

Keep each example independent, with its own dependencies, lockfiles where applicable, and runtime versions managed through mise. Do not require readers to install or run unrelated examples.

## What each example includes

- An English README linking to the article and explaining the problem, prerequisites, installation, execution, expected results, and limitations.
- The smallest runnable implementation that demonstrates the article's point.
- Tests that verify the behavior being explained, including relevant failure cases.
- Explicit runtime and dependency versions, with any required external services and costs documented.

Never commit credentials, private data, or secret files. Document secret requirements without storing their values.

## Links and maintenance

The root README will list each example alongside its article. Articles should link to the example directory at the exact commit used for publication, so later changes do not silently change the referenced code.

Keep corrections in the same example and document meaningful behavior changes. Projects that become standalone applications or libraries may move to their own repository, with a link retained here.

Article drafts, covers, publication schedules, and engagement records remain in the separate editorial archive.

## License

Original companion code is available under the [MIT License](LICENSE). Third-party packages, models and downloaded data retain their upstream licenses and attribution.
