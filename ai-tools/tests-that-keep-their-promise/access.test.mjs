import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canRead, regressedCanRead } from './access.mjs';
const document = { ownerId: 'owner' };
for (const [name, user, expected] of [
  ['owner', { id: 'owner' }, true],
  ['another user', { id: 'outsider' }, false],
  ['anonymous user', null, false],
]) {
  test(`only the owner can read: ${name}`, () => assert.equal(canRead(user, document), expected));
}
test('a weak assertion misses the authorization regression', () => {
  assert.notEqual(regressedCanRead({ id: 'outsider' }, document), null);
  assert.equal(regressedCanRead({ id: 'outsider' }, document), true);
  assert.equal(canRead({ id: 'outsider' }, document), false);
});
