import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
const readText = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');

const manifest = readJson('package.json');
const lockfile = readJson('package-lock.json');
const failures = [];

if (lockfile.version !== manifest.version) {
  failures.push(`package-lock.json version is ${lockfile.version}, expected ${manifest.version}`);
}

if (lockfile.packages?.['']?.version !== manifest.version) {
  failures.push(
    `package-lock.json root package version is ${lockfile.packages?.['']?.version}, ` +
      `expected ${manifest.version}`
  );
}

if (!readText('CHANGELOG.md').includes(`## [${manifest.version}]`)) {
  failures.push(`CHANGELOG.md has no release heading for ${manifest.version}`);
}

const bugTemplate = readText('.github/ISSUE_TEMPLATE/bug_report.yml');
if (!bugTemplate.includes(`@neuravision/construct@${manifest.version}`)) {
  failures.push(`bug report template does not reference ${manifest.version}`);
}

for (const story of ['stories/AppShell.stories.js', 'stories/AppShellV2.stories.js']) {
  const match = readText(story).match(/Construct(?: Design System)? v(\d+\.\d+\.\d+)/);
  if (!match) {
    failures.push(`${story} has no visible Construct version label`);
  } else if (match[1] !== manifest.version) {
    failures.push(`${story} displays ${match[1]}, expected ${manifest.version}`);
  }
}

if (failures.length) {
  console.error(`Version contract failed:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`Validated Construct version ${manifest.version} across package and visible metadata.`);
