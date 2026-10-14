# Tests that keep their promise

Companion to **The Tests Passed. Did the AI Change What They Prove?** (unpublished draft).

Contract: only a document's owner can read it. These are illustrative fixtures, not production authorization.

```sh
mise install
mise exec -- npm test
```

Node 24.19.0, no packages or network calls. Four passing tests include a regression witness: the wrong implementation passes a weak assertion but violates the outsider case. Review requirements and assertions before accepting a generated patch. This does not verify authentication, tenancy, database scopes or endpoint behavior.

Source: https://nodejs.org/api/test.html
