import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compact } from '@bussolabs/laya-compaction';
test('empty and recent-only transcripts need no model request', async () => {
  const forbidden = { ask() { throw new Error('No candidates should reach the model'); } };
  for (const messages of [[], [{ role: 'user', text: 'Hello', toolUses: [] }]]) {
    const result = await compact(messages, forbidden);
    assert.deepEqual(result.messages, messages);
    assert.equal(result.stats.requests, 0);
  }
});
