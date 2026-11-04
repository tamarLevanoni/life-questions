import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

export function activeMarkdown(path: string) {
  return path.endsWith('.md') && !path.startsWith('docs/planning/done/') &&
    (['README.md', 'AGENTS.md'].includes(path) || path.startsWith('docs/') || path.startsWith('.agents/skills/'));
}
export function markdownLinks(path: string, source: string, root = process.cwd(), exists: (path: string) => boolean = existsSync): string[] {
  const errors: string[] = [];
  const text = source.replace(/```[\s\S]*?```/g, '');
  for (const match of text.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+["'][^)]*)?\)/g)) {
    const link = match[1] ?? match[2];
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(link)) continue;
    let target: string;
    try { target = decodeURIComponent(link.split('#')[0]); } catch { errors.push(`${path}: invalid URL ${link}`); continue; }
    if (!target) continue;
    const absolute = resolve(root, dirname(path), target);
    if (!exists(absolute)) errors.push(`${path}: missing ${relative(root, absolute)}`);
  }
  return errors;
}
export function gitFiles(root = process.cwd()) {
  const result = Bun.spawnSync(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root });
  if (result.exitCode !== 0) throw new Error('Cannot list repository files');
  return [...new Set(result.stdout.toString().split('\0').filter(Boolean))];
}
if (import.meta.main) {
  const files = gitFiles().filter(path => activeMarkdown(path) && existsSync(path));
  const errors = files.flatMap(path => markdownLinks(path, readFileSync(path, 'utf8')));
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`Documentation: ${files.length} active Markdown files have valid local links.`);
}
