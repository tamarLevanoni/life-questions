import { mkdir } from 'node:fs/promises';
import { testEnvironment } from './environment';

Object.assign(process.env, testEnvironment);
await mkdir('.cache/e2e', { recursive: true });
await Bun.write('.cache/e2e/tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.json',
  compilerOptions: { incremental: false },
  include: ['../../next-env.d.ts', '../../app/**/*.ts', '../../app/**/*.tsx', '../../components/**/*.tsx', '../../lib/**/*.ts', '../../lib/**/*.tsx', '../../types/**/*.d.ts', '../../.next-e2e/types/**/*.ts'],
  exclude: ['../../node_modules', '../../.claude'],
}, null, 2) + '\n');

const mode = process.argv[2] ?? 'start';
async function run(args: string[]) {
  const env: Record<string, string | undefined> = { ...process.env, ...testEnvironment };
  delete env.FORCE_COLOR;
  const child = Bun.spawn(['bunx', '--no-install', 'next', ...args], { env, stdout: 'inherit', stderr: 'inherit' });
  const stop = () => { child.kill('SIGTERM'); };
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
  const code = await child.exited;
  process.off('SIGTERM', stop); process.off('SIGINT', stop);
  if (code !== 0) process.exit(code);
}
if (mode === 'dev') await run(['dev', '--hostname', 'localhost', '--port', '3100']);
else {
  await run(['build']);
  if (mode !== 'build') await run(['start', '--hostname', 'localhost', '--port', '3100']);
}
