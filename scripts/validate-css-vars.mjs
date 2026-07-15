import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');

const entryPoints = [
  path.join(rootDir, 'foundations.css'),
  path.join(rootDir, 'components', 'index.css'),
  ...fs
    .readdirSync(path.join(rootDir, 'standalone'))
    .filter((file) => file.endsWith('.css'))
    .sort()
    .map((file) => path.join(rootDir, 'standalone', file)),
];

const importPattern = /@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/g;
const definitionPattern = /(--[A-Za-z0-9_-]+)\s*:/g;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, ' ')
  );
}

function localImports(file, css) {
  return [...stripComments(css).matchAll(importPattern)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'))
    .map((specifier) => path.resolve(path.dirname(file), specifier));
}

function readClosure(entry) {
  const files = new Map();

  function visit(file) {
    if (files.has(file)) return;
    if (!fs.existsSync(file)) {
      throw new Error(`${path.relative(rootDir, entry)} imports missing file ${path.relative(rootDir, file)}`);
    }
    const css = fs.readFileSync(file, 'utf8');
    files.set(file, css);
    for (const dependency of localImports(file, css)) visit(dependency);
  }

  visit(entry);
  return files;
}

function hasFallback(css, startIndex) {
  let depth = 1;
  for (let index = startIndex; index < css.length; index += 1) {
    if (css[index] === '(') depth += 1;
    if (css[index] === ')') depth -= 1;
    if (css[index] === ',' && depth === 1) return true;
    if (depth === 0) return false;
  }
  return false;
}

function variableUses(file, css) {
  const uses = [];
  const pattern = /var\(\s*(--[A-Za-z0-9_-]+)/g;
  for (const match of css.matchAll(pattern)) {
    const line = css.slice(0, match.index).split('\n').length;
    uses.push({
      name: match[1],
      file,
      line,
      hasFallback: hasFallback(css, match.index + match[0].length),
    });
  }
  return uses;
}

const failures = [];
for (const entry of entryPoints) {
  const closure = readClosure(entry);
  const definitions = new Set();
  const uses = [];

  for (const [file, css] of closure) {
    const source = stripComments(css);
    for (const match of source.matchAll(definitionPattern)) definitions.add(match[1]);
    uses.push(...variableUses(file, source));
  }

  for (const use of uses) {
    const isLocalExtensionHook = use.name.startsWith('--ct-') || use.name.startsWith('--_');
    if (!definitions.has(use.name) && !(use.hasFallback && isLocalExtensionHook)) {
      failures.push(
        `${path.relative(rootDir, entry)}: ${use.name} is unresolved at ` +
          `${path.relative(rootDir, use.file)}:${use.line}`
      );
    }
  }
}

if (failures.length) {
  console.error(`Unresolved CSS custom properties:\n${[...new Set(failures)].join('\n')}`);
  process.exit(1);
}

console.log(`Validated CSS variable closure for ${entryPoints.length} public entry points.`);
