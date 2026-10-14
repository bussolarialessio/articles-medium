import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout.trim();
}
const folder = fileURLToPath(new URL('.', import.meta.url));
const root = run('git', ['rev-parse', '--show-toplevel'], folder);
const example = relative(root, folder);
const temp = await mkdtemp(join(tmpdir(), 'article-clean-clone-'));
try {
  run('git', ['clone', '--no-local', '--quiet', root, join(temp, 'clone')], temp);
  const cleanFolder = resolve(temp, 'clone', example);
  await access(join(cleanFolder, 'app.mjs'));
  const output = run(process.execPath, ['app.mjs'], cleanFolder);
  if (output !== 'Hello from a clean clone') throw new Error('Unexpected application output');
  console.log(`PASS: committed files run from a fresh local clone on Node ${process.version}`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
