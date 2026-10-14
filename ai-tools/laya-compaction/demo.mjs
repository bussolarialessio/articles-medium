import { readFile } from 'node:fs/promises';
import { compactMessages } from '@bussolabs/laya-compaction';
// Capture an actual read, then move it outside the six newest messages.
const text = await readFile(new URL('./README.md', import.meta.url), 'utf8');
const messages = [
  { role: 'user', text: 'Read the example documentation.', toolUses: [] },
  { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'read-1', tool: 'Read', input: { file_path: 'README.md' } }] },
  { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'read-1', text }] },
  ...Array.from({ length: 6 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: i % 2 ? 'The document can be read again.' : 'Keep explaining the setup.', toolUses: [] })),
];
const result = await compactMessages(messages, { url: 'http://127.0.0.1:18766', apiKey: '', model: 'multilingual', goal: 'Explain how to reproduce this example.' });
console.log(JSON.stringify(result, null, 2));
