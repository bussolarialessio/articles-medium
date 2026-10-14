import { readFile } from 'node:fs/promises';
const config = JSON.parse(await readFile(new URL('./config.json', import.meta.url), 'utf8'));
if (typeof config.greeting !== 'string' || !config.greeting.trim()) {
  throw new TypeError('config.json must define a non-empty greeting');
}
console.log(config.greeting);
