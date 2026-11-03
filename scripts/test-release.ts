import { release } from 'node:os';

const args = process.argv.slice(2);
const projects = args.flatMap((arg, index) => arg.startsWith('--project=') ? [arg.slice(10)] : arg === '--project' ? [args[index + 1]] : []);
const includesWebKit = !projects.length || projects.some(project => project === 'webkit' || project?.includes('*'));
if (includesWebKit && process.platform === 'darwin' && Number(release().split('.')[0]) < 24) {
  console.error('Release check blocked: this macOS uses frozen WebKit 2251, incompatible with Playwright 1.64 (PushAPIEnabled).');
  console.error('Run the complete release check in Linux CI or macOS 15+. Available local checks:');
  console.error('bun run test:release --project=chromium --project=mobile-chromium --project=firefox');
  console.error('This does not verify WebKit. Details: docs/testing.md');
  process.exit(1);
}
const child = Bun.spawn(['bunx', '--no-install', 'playwright', 'test', ...args], {
  env: { ...process.env, TEST_RELEASE: '1' }, stdin: 'inherit', stdout: 'inherit', stderr: 'inherit',
});
process.exit(await child.exited);
