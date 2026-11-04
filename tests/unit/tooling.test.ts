import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkStaged, git } from '../../scripts/check-staged';
import { markdownLinks } from '../../scripts/check-docs';

let root: string;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'life-questions-hooks-'));
  git(['init', '-q'], root);
  await writeFile(join(root, 'eslint.config.mjs'), "export default [{files:['**/*.js'],rules:{'no-unused-vars':'error'}}];\n");
  git(['add', 'eslint.config.mjs'], root);
  git(['-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-qm', 'fixture baseline'], root);
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); });

test('staged check reads the index with spaces, without replacing partially staged edits', async () => {
  const path = join(root, 'a file.js');
  await writeFile(path, 'const unused = 1;\n'); git(['add', 'a file.js'], root);
  await writeFile(path, 'console.log(1);\n');
  expect(await checkStaged(root)).not.toHaveLength(0);
  expect(await readFile(path, 'utf8')).toBe('console.log(1);\n');
  git(['add', 'a file.js'], root); await writeFile(path, 'const workingDraft = 2;\n');
  expect(await checkStaged(root)).toEqual([]);
  expect(git(['show', ':a file.js'], root)).toBe('console.log(1);\n');
  expect(await readFile(path, 'utf8')).toBe('const workingDraft = 2;\n');
});

test('staged documentation checks links against staged targets', async () => {
  await writeFile(join(root, 'README.md'), '[target](<docs/a file.md>)\n');
  await mkdir(join(root, 'docs')); await writeFile(join(root, 'docs/a file.md'), '# Target\n');
  git(['add', 'README.md'], root);
  expect(await checkStaged(root)).not.toHaveLength(0);
  git(['add', 'docs/a file.md'], root);
  expect(await checkStaged(root)).toEqual([]);
});

test('documentation checks local paths while skipping URLs and fenced examples', () => {
  expect(markdownLinks('README.md', '[missing](missing.md)', root)).toHaveLength(1);
  expect(markdownLinks('README.md', '[existing](eslint.config.mjs) [web](https://example.test)\n```md\n[x](missing.md)\n```', root)).toEqual([]);
});
