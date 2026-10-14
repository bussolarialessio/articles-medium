import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('the clean clone detects a file that exists locally but is absent from HEAD', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'article-clone-test-'));
  const run = (command, args) => spawnSync(command, args, { cwd: directory, encoding: 'utf8' });
  const git = (...args) => {
    const result = run('git', args);
    assert.equal(result.status, 0, result.stderr);
  };
  try {
    for (const name of ['app.mjs', 'verify.mjs', 'config.json']) {
      await copyFile(new URL(name, import.meta.url), join(directory, name));
    }
    git('init', '--quiet');
    git('add', 'app.mjs', 'verify.mjs', 'config.json');
    const commit = message => git('-c', 'user.name=Example verification', '-c', 'user.email=example@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', message);
    commit('Track the complete example');
    assert.equal(run(process.execPath, ['verify.mjs']).status, 0);
    git('rm', '--cached', 'config.json');
    commit('Reproduce missing committed configuration');
    assert.equal(run(process.execPath, ['app.mjs']).status, 0);
    const failure = run(process.execPath, ['verify.mjs']);
    assert.notEqual(failure.status, 0);
    assert.match(failure.stderr, /config\.json/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
