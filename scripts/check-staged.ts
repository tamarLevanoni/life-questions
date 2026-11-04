import { ESLint } from 'eslint';
import { relative, resolve } from 'node:path';
import { activeMarkdown, markdownLinks } from './check-docs';

export function git(args: string[], root = process.cwd()) {
  const result = Bun.spawnSync(['git', ...args], { cwd: root });
  if (result.exitCode !== 0) throw new Error(`git ${args[0]} failed`);
  return result.stdout.toString();
}
export async function checkStaged(root = process.cwd()) {
  const names = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], root).split('\0').filter(Boolean);
  const eslint = new ESLint({ cwd: root });
  const errors: string[] = [];
  const inIndex = (absolute: string) => {
    const path = relative(root, absolute).split('\\').join('/');
    if (path.startsWith('../')) return false;
    return git(['ls-files', '--cached', '-z', '--', path], root).length > 0;
  };
  for (const name of names) {
    const content = git(['show', `:${name}`], root);
    if (activeMarkdown(name)) errors.push(...markdownLinks(name, content, root, inIndex));
    if (!/\.(?:[cm]?[jt]sx?)$/.test(name) || await eslint.isPathIgnored(resolve(root, name))) continue;
    const result = await eslint.lintText(content, { filePath: resolve(root, name) });
    if (result.some(r => r.errorCount > 0)) errors.push(await (await eslint.loadFormatter('stylish')).format(result));
  }
  return errors;
}
if (import.meta.main) {
  try {
    const errors = await checkStaged();
    if (errors.length) { console.error(errors.join('\n')); console.error('Commit check failed. Fix staged content; run bun run check.'); process.exit(1); }
    console.log('Staged code and documentation checks passed.');
  } catch (error) { console.error(error instanceof Error ? error.message : 'Staged check failed'); process.exit(1); }
}
