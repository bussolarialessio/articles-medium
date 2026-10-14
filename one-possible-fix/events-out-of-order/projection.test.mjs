import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applySnapshot } from './projection.mjs';
const v1 = { entityId: 'order-1', revision: 1, status: 'open' };
const v2 = { entityId: 'order-1', revision: 2, status: 'closed' };
test('accepts the first snapshot', () => assert.deepEqual(applySnapshot(null, v1), v1));
test('an older arrival cannot restore obsolete status', () => {
  const current = applySnapshot(null, v2);
  assert.equal(applySnapshot(current, v1), current);
});
test('duplicates have no effect', () => {
  const current = applySnapshot(null, v2);
  assert.equal(applySnapshot(current, v2), current);
});
test('newer snapshots advance the projection', () => assert.deepEqual(applySnapshot(v1, v2), v2));
test('entities cannot share one revision slot', () => {
  assert.throws(() => applySnapshot(v1, { ...v2, entityId: 'order-2' }), /same entity/);
});
test('invalid and partial snapshots fail', () => {
  for (const revision of [-1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => applySnapshot(null, { ...v1, revision }), /safe integer/);
  }
  assert.throws(() => applySnapshot(null, { entityId: 'order-1', revision: 1 }), /complete/);
});
test('out-of-order deliveries converge', () => {
  for (const events of [[v1, v2, v1], [v2, v1, v2], [v1, v1, v2]]) {
    assert.deepEqual(events.reduce(applySnapshot, null), v2);
  }
});
