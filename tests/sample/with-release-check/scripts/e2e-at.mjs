// Runs Shelf's Playwright tests against Shelf as it runs at an address, such as production, with no local server:
//   npm run test:e2e:at -- <address> [Playwright's own arguments]
// The address comes as an argument, since a variable set before a command isn't written the same way in every shell.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const [address, ...rest] = process.argv.slice(2);
if (!address || !/^https?:\/\/\S+$/.test(address)) {
	console.error('Give the address to test, such as: npm run test:e2e:at -- http://localhost:8788');
	process.exit(2);
}
const cli = createRequire(import.meta.url).resolve('@playwright/test/cli');
const run = spawnSync(process.execPath, [cli, 'test', ...rest], {
	stdio: 'inherit',
	env: { ...process.env, SHELF_BASE_URL: address.replace(/\/+$/, '') }
});
process.exit(run.status ?? 1);
