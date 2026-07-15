import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const componentsDir = path.join(rootDir, 'components');
const standaloneDir = path.join(rootDir, 'standalone');
const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const failures = [];
const legacyComponentExports = new Map([
  ['./components/_keyframes.css', './components/_keyframes.css'],
  ['./components/_shared.css', './components/_shared.css'],
  ['./components/_shell-shared.css', './components/_shell-shared.css'],
]);

function targets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(targets);
}

function concreteTargets(specifier) {
  const exports = manifest.exports ?? {};
  if (Object.hasOwn(exports, specifier)) return targets(exports[specifier]);

  const matches = Object.entries(exports)
    .filter(([pattern]) => pattern.includes('*'))
    .map(([pattern, value]) => {
      const wildcardIndex = pattern.indexOf('*');
      const prefix = pattern.slice(0, wildcardIndex);
      const suffix = pattern.slice(wildcardIndex + 1);
      const matchesPattern =
        specifier.startsWith(prefix) &&
        specifier.endsWith(suffix) &&
        specifier.length >= prefix.length + suffix.length;
      return { pattern, value, prefix, suffix, matchesPattern };
    })
    .filter(({ matchesPattern }) => matchesPattern)
    .sort((left, right) => right.prefix.length - left.prefix.length);

  if (!matches.length) return [];
  const { value, prefix, suffix } = matches[0];
  const wildcardValue = specifier.slice(
    prefix.length,
    suffix.length ? -suffix.length : undefined
  );
  return targets(value).map((target) => target.replaceAll('*', wildcardValue));
}

function assertConcreteExport(specifier, expectedTarget) {
  const resolvedTargets = concreteTargets(specifier);
  if (!resolvedTargets.length) {
    failures.push(`${specifier} is not exported`);
    return;
  }
  if (!resolvedTargets.includes(expectedTarget)) {
    failures.push(
      `${specifier} resolves to ${resolvedTargets.join(', ')}, expected ${expectedTarget}`
    );
  }
  for (const target of resolvedTargets) {
    if (!fs.existsSync(path.resolve(rootDir, target))) {
      failures.push(`${specifier} resolves to missing ${target}`);
    }
  }
}

for (const [specifier, value] of Object.entries(manifest.exports ?? {})) {
  for (const target of targets(value)) {
    if (target.includes('*')) {
      const wildcardIndex = target.indexOf('*');
      const slashIndex = target.lastIndexOf('/', wildcardIndex);
      const directory = path.resolve(rootDir, target.slice(0, slashIndex));
      const targetPrefix = target.slice(slashIndex + 1, wildcardIndex);
      const suffix = target.slice(wildcardIndex + 1);
      const matches = fs.existsSync(directory)
        ? fs
            .readdirSync(directory)
            .filter((file) => file.startsWith(targetPrefix) && file.endsWith(suffix))
        : [];
      if (!matches.length) failures.push(`${specifier} targets no files via ${target}`);
      continue;
    }

    const outputPath = path.resolve(rootDir, target);
    if (!fs.existsSync(outputPath)) failures.push(`${specifier} targets missing ${target}`);
  }
}

const authoredComponentFiles = fs
  .readdirSync(componentsDir)
  .filter(
    (file) =>
      file.endsWith('.css') &&
      !file.startsWith('_') &&
      !['components.css', 'index.css'].includes(file)
  )
  .sort();
const indexCss = fs.readFileSync(path.join(componentsDir, 'index.css'), 'utf8');
const importPattern = /@import\s+(?:url\()?['"]\.\/([^'"]+\.css)['"]\)?\s*;/g;
const indexedComponentFiles = [...indexCss.matchAll(importPattern)]
  .map((match) => match[1])
  .filter((file) => !file.startsWith('_'));
const indexedComponentSet = new Set(indexedComponentFiles);
const authoredComponentSet = new Set(authoredComponentFiles);

if (indexedComponentSet.size !== indexedComponentFiles.length) {
  failures.push('components/index.css imports a public component more than once');
}
for (const file of authoredComponentFiles) {
  if (!indexedComponentSet.has(file)) {
    failures.push(`components/index.css does not import public component ${file}`);
  }
  assertConcreteExport(`./components/${file}`, `./standalone/${file}`);
}
for (const file of indexedComponentSet) {
  if (!authoredComponentSet.has(file)) {
    failures.push(`components/index.css imports unknown public component ${file}`);
  }
}

const standaloneComponentFiles = fs
  .readdirSync(standaloneDir)
  .filter((file) => file.endsWith('.css') && file !== 'core.css')
  .sort();
const standaloneComponentSet = new Set(standaloneComponentFiles);
for (const file of authoredComponentFiles) {
  if (!standaloneComponentSet.has(file)) {
    failures.push(`standalone/${file} is missing for public component ${file}`);
  }
}
for (const file of standaloneComponentFiles) {
  if (!authoredComponentSet.has(file)) {
    failures.push(`standalone/${file} has no authored public component`);
  }
}

for (const [specifier, expectedTarget] of legacyComponentExports) {
  if (!Object.hasOwn(manifest.exports ?? {}, specifier)) {
    failures.push(`${specifier} must remain an exact legacy export`);
    continue;
  }
  assertConcreteExport(specifier, expectedTarget);
}

for (const [name, target] of Object.entries(manifest.bin ?? {})) {
  const executablePath = path.resolve(rootDir, target);
  if (!fs.existsSync(executablePath)) {
    failures.push(`bin ${name} targets missing ${target}`);
    continue;
  }
  const source = fs.readFileSync(executablePath, 'utf8');
  if (!source.startsWith('#!/usr/bin/env node\n')) {
    failures.push(`bin ${name} target ${target} has no Node shebang`);
  }
  if ((fs.statSync(executablePath).mode & 0o111) === 0) {
    failures.push(`bin ${name} target ${target} is not executable`);
  }
}

if (failures.length) {
  console.error(`Invalid package exports:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(
  `Validated ${Object.keys(manifest.exports ?? {}).length} package export entries, ` +
    `${authoredComponentFiles.length} standalone component specifiers, ` +
    `${legacyComponentExports.size} legacy component exports, and ` +
    `${Object.keys(manifest.bin ?? {}).length} executable.`
);
