// Sets one version in every manifest that has the key, turns the CHANGELOG's [Unreleased]
// section into that version, and then runs the check.
//
// Usage, from anywhere in the repository:
//   npm run bump -- <x.y.z>
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const version = process.argv[2];
if (!SEMVER.test(version ?? '')) {
  console.error('Usage: npm run bump -- <x.y.z>, where <x.y.z> is a semantic version.');
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const pkg = readJson('package.json');
if (pkg.version === version) {
  console.error(`The version is already ${version}.`);
  process.exit(1);
}
const changelogFile = join(root, 'CHANGELOG.md');
const changelog = readFileSync(changelogFile, 'utf8');
if (!changelog.includes('## [Unreleased]')) {
  console.error('CHANGELOG.md has no "## [Unreleased]" section to turn into the new version.');
  process.exit(1);
}
if (changelog.includes(`## [${version}]`)) {
  console.error(`CHANGELOG.md already has a section for ${version}.`);
  process.exit(1);
}

const edit =(path, change) => {
  const manifest = readJson(path);
  change(manifest);
  writeFileSync(join(root, path), `${JSON.stringify(manifest, null, 2)}\n`);
};
for (const path of ['package.json', 'plugin.json', '.claude-plugin/plugin.json']) {
  edit(path, (manifest) => {
    manifest.version = version;
  });
}
edit('.claude-plugin/marketplace.json', (market) => {
  for (const entry of market.plugins ?? []) if (entry.name === pkg.name && 'version' in entry) entry.version = version;
});

// The date where the owner is, not in UTC.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
writeFileSync(changelogFile, changelog.replace('## [Unreleased]', `## [Unreleased]\n\n## [${version}] - ${today}`));

console.log(`Version ${version} is in the four manifests that carry one and in CHANGELOG.md. Checking:`);
const check = spawnSync(process.execPath, [join(root, 'scripts', 'check.mjs')], { stdio: 'inherit' });
process.exitCode = check.status ?? 1;
