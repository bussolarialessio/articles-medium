import { askLaya, remoteAsker } from '@bussolabs/laya-router/src/router.mjs';
import { TIERS } from '@bussolabs/laya-router/src/config.mjs';
import { decide } from '@bussolabs/laya-router/src/policy.mjs';
const prompt = process.argv[2] ?? 'Fix a spelling mistake in the README';
const models = TIERS.filter(t => t.name !== 'fable').map(t => ({ ...t, tier: t.name, description: t.id }));
const current = models.find(t => t.tier === 'sonnet');
const prediction = await askLaya({ prompt, current: current.id, contextTokens: 900, models },
  remoteAsker({ url: 'http://127.0.0.1:18765', model: 'multilingual' }));
if (prediction?.response?.usage?.truncated) {
  throw new Error('The decision input was truncated; use a checkpoint with a sufficient context window');
}
const selected = models.find(m => m.id === prediction?.choice);
const decision = decide({ prompt, current: current.tier, available: models.map(m => m.tier), contextTokens: 900,
  laya: prediction ? { ...prediction, choice: selected?.tier } : null });
console.log(JSON.stringify({ predictionAvailable: prediction !== null, prediction, decision }, null, 2));
if (!prediction) process.exitCode = 1;
