import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decide } from '@bussolabs/laya-router/src/policy.mjs';
const base = { prompt: 'Review this change', current: 'sonnet', available: ['haiku', 'sonnet', 'opus'], contextTokens: 0 };
test('unavailable prediction preserves the current tier', () => assert.equal(decide({ ...base, laya: null }).tier, 'sonnet'));
test('low confidence refuses a downgrade', () => {
  assert.equal(decide({ ...base, laya: { choice: 'haiku', confidence: 0.29 } }).tier, 'sonnet');
});
test('the confidence boundary permits the recommendation', () => {
  assert.equal(decide({ ...base, laya: { choice: 'haiku', confidence: 0.3 } }).tier, 'haiku');
});
test('the cache guard starts above twenty thousand tokens', () => {
  const laya = { choice: 'haiku', confidence: 0.9 };
  assert.equal(decide({ ...base, laya, contextTokens: 20000 }).tier, 'haiku');
  assert.equal(decide({ ...base, laya, contextTokens: 20001 }).tier, 'sonnet');
});
test('an explicit whole-prompt override wins', () => {
  assert.equal(decide({ ...base, prompt: 'use opus', laya: null }).tier, 'opus');
});
