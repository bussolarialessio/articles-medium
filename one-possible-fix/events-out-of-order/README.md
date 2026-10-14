# Events out of order

Companion to **The Events Arrived. In the Wrong Order.** (unpublished conceptual article).

```sh
mise install
mise exec -- npm test
```

Node 24.19.0, no dependencies. Seven tests exercise an in-memory reducer over illustrative snapshots.

Preconditions: complete snapshots; one authoritative producer assigning strictly increasing revisions per entity; equal revisions identify the same immutable snapshot. Conflicting payloads at an equal revision need separate detection.

This is not a concurrent database implementation. Persist the comparison and update atomically per entity; represent deletion with versioned tombstones. Do not use this with deltas: skipping an old increment loses information. Event IDs deduplicate; arrival times do not establish producer revisions. Stripe does not promise this example's revision field.

Source: https://docs.stripe.com/webhooks#event-ordering
