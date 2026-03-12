import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const designDir = path.resolve(scriptDir, '..');
const tokensDir = path.join(designDir, 'tokens');

const primitivesPath = path.join(tokensDir, 'primitives.json');
const semanticThemeFiles = {
  light: path.join(tokensDir, 'semantic.light.json'),
  dark: path.join(tokensDir, 'semantic.dark.json'),
  highContrast: path.join(tokensDir, 'semantic.high-contrast.json'),
};

const outCssPath = path.join(tokensDir, 'tokens.css');
const outJsonPath = path.join(tokensDir, 'tokens.json');
const outTsPath = path.join(tokensDir, 'tokens.ts');
const outJsPath = path.join(tokensDir, 'tokens.js');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const showHelp = args.has('--help') || args.has('-h');

if (showHelp) {
  console.log(
    [
      'Usage: node design/scripts/build-tokens.mjs [--check]',
      '',
      'Generates CSS/TS/JSON outputs from primitives.json + semantic theme files.',
      '  --check  exits with non-zero if outputs are not up to date.',
    ].join('\n')
  );
  process.exit(0);
}

const primitives = JSON.parse(fs.readFileSync(primitivesPath, 'utf8'));
const semanticBase = JSON.parse(fs.readFileSync(semanticThemeFiles.light, 'utf8'));
const semanticOverrides = {
  dark: JSON.parse(fs.readFileSync(semanticThemeFiles.dark, 'utf8')),
  highContrast: JSON.parse(fs.readFileSync(semanticThemeFiles.highContrast, 'utf8')),
};

const fontFallbacks = {
  brand: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
  text: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
  mono: ['"SFMono-Regular"', 'Menlo', 'monospace'],
};

const kebabize = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const flatten = (obj, basePath = []) => {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    const nextPath = [...basePath, key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      entries.push(...flatten(value, nextPath));
    } else {
      entries.push({ path: nextPath, value });
    }
  }
  return entries;
};

const mergeDeep = (base, override) => {
  if (override === undefined) return base;
  if (!override || typeof override !== 'object' || Array.isArray(override)) {
    return override;
  }
  const output = Array.isArray(base) ? [...base] : { ...(base ?? {}) };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      output[key] = mergeDeep(base[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
};

const setNested = (target, pathParts, value) => {
  let current = target;
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const key = pathParts[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[pathParts[pathParts.length - 1]] = value;
};

const isFontFamilyPath = (pathParts) =>
  pathParts[0] === 'font' && pathParts[1] === 'family';

const formatFontStack = (value, familyKey) => {
  if (typeof value !== 'string') return value;
  if (value.includes(',')) return value;
  const quoted = value.startsWith('"') || value.startsWith("'") ? value : `"${value}"`;
  const fallbacks = fontFallbacks[familyKey] ?? [];
  return [quoted, ...fallbacks].join(', ');
};

const inferUnit = (pathParts) => {
  const [group, subgroup] = pathParts;
  if (group === 'font') {
    if (subgroup === 'size' || subgroup === 'lineHeight' || subgroup === 'letterSpacing') {
      return 'px';
    }
    return '';
  }
  if (group === 'space') return 'px';
  if (group === 'radius') return 'px';
  if (group === 'border') return 'px';
  if (group === 'opacity') return '';
  if (group === 'size') return 'px';
  if (group === 'layout') return 'px';
  if (group === 'shadow') return '';
  if (group === 'motion') return subgroup === 'duration' ? 'ms' : '';
  if (group === 'zIndex') return '';
  if (group === 'breakpoint') return 'px';
  return '';
};

const formatValue = (pathParts, value) => {
  if (typeof value === 'number') {
    const unit = inferUnit(pathParts);
    return unit ? `${value}${unit}` : `${value}`;
  }
  if (isFontFamilyPath(pathParts)) {
    return formatFontStack(value, pathParts[2]);
  }
  return value;
};

const parseReference = (value) => {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{(.+)\}$/);
  return match ? match[1].split('.') : null;
};

const primitiveVarName = (pathParts) => {
  const [group, subgroup, key] = pathParts;
  if (group === 'color') return `color-${kebabize(subgroup)}-${kebabize(key)}`;
  if (group === 'font' && subgroup === 'family') return `font-family-${kebabize(key)}`;
  if (group === 'font' && subgroup === 'weight') return `font-weight-${kebabize(key)}`;
  if (group === 'font' && subgroup === 'size') return `font-size-${kebabize(key)}`;
  if (group === 'font' && subgroup === 'lineHeight') return `line-height-${kebabize(key)}`;
  if (group === 'font' && subgroup === 'letterSpacing') {
    return `letter-spacing-${kebabize(key)}`;
  }
  if (group === 'space') return `space-${kebabize(subgroup)}`;
  if (group === 'radius') return `radius-${kebabize(subgroup)}`;
  if (group === 'border' && subgroup === 'width') return `border-${kebabize(key)}`;
  if (group === 'opacity') return `opacity-${kebabize(subgroup)}`;
  if (group === 'size' && subgroup === 'controlHeight') return `control-height-${kebabize(key)}`;
  if (group === 'size' && subgroup === 'icon') return `icon-${kebabize(key)}`;
  if (group === 'layout' && subgroup === 'container') return `container-${kebabize(key)}`;
  if (group === 'layout' && subgroup === 'gutter') return `gutter-${kebabize(key)}`;
  if (group === 'layout' && subgroup === 'gridGap') return `grid-gap-${kebabize(key)}`;
  if (group === 'shadow') return `shadow-${kebabize(subgroup)}`;
  if (group === 'motion' && subgroup === 'duration') return `duration-${kebabize(key)}`;
  if (group === 'motion' && subgroup === 'easing') return `easing-${kebabize(key)}`;
  if (group === 'zIndex') return `z-${kebabize(subgroup)}`;
  if (group === 'breakpoint') return `bp-${kebabize(subgroup)}`;
  return pathParts.map(kebabize).join('-');
};

const semanticVarName = (pathParts) => {
  const [group, subgroup, key] = pathParts;
  if (group === 'typography') {
    return `type-${kebabize(subgroup)}-${kebabize(key)}`;
  }
  if (group === 'color') {
    if (subgroup === 'background') return `color-bg-${kebabize(key)}`;
    if (subgroup === 'stateSurface') return `color-state-${kebabize(key)}-surface`;
    if (subgroup === 'stateBorder') return `color-state-${kebabize(key)}-border`;
    if (subgroup === 'focus') return `color-focus-${kebabize(key)}`;
    if (subgroup === 'overlay') return `color-overlay-${kebabize(key)}`;
    return `color-${kebabize(subgroup)}-${kebabize(key)}`;
  }
  if (group === 'font' && subgroup === 'family') return `font-family-${kebabize(key)}`;
  if (group === 'radius') return `radius-${kebabize(subgroup)}`;
  if (group === 'shadow') return `shadow-${kebabize(subgroup)}`;
  return pathParts.map(kebabize).join('-');
};

const primitivesFlat = flatten(primitives);

const primitiveValueByPath = new Map();
const primitiveVarByPath = new Map();

for (const entry of primitivesFlat) {
  const pathKey = entry.path.join('.');
  const value = formatValue(entry.path, entry.value);
  primitiveValueByPath.set(pathKey, value);
  primitiveVarByPath.set(pathKey, primitiveVarName(entry.path));
}

const buildCssEntries = (entries, kind, { primitiveVarByPath, semanticVarByPath }) =>
  entries.map((entry) => {
    const refPath = parseReference(entry.value);
    const name =
      kind === 'primitive' ? primitiveVarName(entry.path) : semanticVarName(entry.path);
    let value;
    if (refPath) {
      const refKey = refPath.join('.');
      const refVar = primitiveVarByPath.get(refKey) ?? semanticVarByPath?.get(refKey);
      if (!refVar) {
        throw new Error(`Unknown token reference: ${entry.value}`);
      }
      value = `var(--${refVar})`;
    } else {
      value = formatValue(entry.path, entry.value);
    }
    return { name, value };
  });

const buildSemanticTheme = (semantic) => {
  const semanticFlat = flatten(semantic);
  const semanticVarByPath = new Map();
  const semanticValueByPath = new Map();
  const semanticPathByKey = new Map();

  for (const entry of semanticFlat) {
    const pathKey = entry.path.join('.');
    semanticVarByPath.set(pathKey, semanticVarName(entry.path));
    semanticValueByPath.set(pathKey, entry.value);
    semanticPathByKey.set(pathKey, entry.path);
  }

  const semanticResolvedByPath = new Map();
  const resolving = new Set();

  const resolveSemanticValue = (pathKey) => {
    if (semanticResolvedByPath.has(pathKey)) return semanticResolvedByPath.get(pathKey);
    if (resolving.has(pathKey)) {
      throw new Error(`Circular semantic reference: ${pathKey}`);
    }
    resolving.add(pathKey);
    if (!semanticValueByPath.has(pathKey)) {
      throw new Error(`Unknown semantic token: ${pathKey}`);
    }
    const rawValue = semanticValueByPath.get(pathKey);
    const refPath = parseReference(rawValue);
    let resolvedValue;
    if (refPath) {
      const refKey = refPath.join('.');
      if (primitiveValueByPath.has(refKey)) {
        resolvedValue = primitiveValueByPath.get(refKey);
      } else if (semanticValueByPath.has(refKey)) {
        resolvedValue = resolveSemanticValue(refKey);
      } else {
        throw new Error(`Unknown token reference: ${rawValue}`);
      }
    } else {
      const pathParts = semanticPathByKey.get(pathKey);
      resolvedValue = formatValue(pathParts, rawValue);
    }
    semanticResolvedByPath.set(pathKey, resolvedValue);
    resolving.delete(pathKey);
    return resolvedValue;
  };

  const semanticOut = {};
  for (const entry of semanticFlat) {
    const pathKey = entry.path.join('.');
    const value = resolveSemanticValue(pathKey);
    setNested(semanticOut, entry.path, value);
  }

  const semanticCssEntries = buildCssEntries(semanticFlat, 'semantic', {
    primitiveVarByPath,
    semanticVarByPath,
  });

  return { semanticFlat, semanticVarByPath, semanticOut, semanticCssEntries };
};

const semanticThemes = {
  light: buildSemanticTheme(semanticBase),
  dark: buildSemanticTheme(mergeDeep(semanticBase, semanticOverrides.dark)),
  highContrast: buildSemanticTheme(mergeDeep(semanticBase, semanticOverrides.highContrast)),
};

const semanticLight = semanticThemes.light;
const semanticDark = semanticThemes.dark;
const semanticHighContrast = semanticThemes.highContrast;

const primitiveCssEntries = buildCssEntries(primitivesFlat, 'primitive', {
  primitiveVarByPath,
  semanticVarByPath: null,
});

const semanticLightEntries = semanticLight.semanticCssEntries;
const semanticDarkEntries = semanticDark.semanticCssEntries;
const semanticHighContrastEntries = semanticHighContrast.semanticCssEntries;

const semanticTypographyEntries = semanticLightEntries.filter((entry) =>
  entry.name.startsWith('type-')
);
const semanticLightNonTypeEntries = semanticLightEntries.filter(
  (entry) => !entry.name.startsWith('type-')
);
const themeTokenFilter = (entry) =>
  entry.name.startsWith('color-') || entry.name.startsWith('theme-');
const semanticDarkThemeEntries = semanticDarkEntries.filter(themeTokenFilter);
const semanticHighContrastThemeEntries = semanticHighContrastEntries.filter(themeTokenFilter);

const section = (label, entries, indent = 2) => {
  if (!entries.length) return [];
  const pad = ' '.repeat(indent);
  return [`${pad}/* ${label} */`, ...entries.map((entry) => `${pad}--${entry.name}: ${entry.value};`)];
};

const themeBlock = (selector, label, entries) => {
  if (!entries.length) return [];
  return [
    `${selector} {`,
    ...section(`Semantic (${label})`, entries, 2),
    '}',
    '',
  ];
};

const mediaBlock = (query, selector, label, entries) => {
  if (!entries.length) return [];
  return [
    `@media ${query} {`,
    `  ${selector} {`,
    ...section(`Semantic (${label})`, entries, 4),
    '  }',
    '}',
    '',
  ];
};

const cssLines = [
  '/* Generated by design/scripts/build-tokens.mjs. Do not edit directly. */',
  ':root {',
  ...section('Color primitives', primitiveCssEntries.filter((entry) => entry.name.startsWith('color-'))),
  ...section('Typography', primitiveCssEntries.filter((entry) => entry.name.startsWith('font-') || entry.name.startsWith('line-height-') || entry.name.startsWith('letter-spacing-'))),
  ...section('Semantic typography', semanticTypographyEntries),
  ...section('Spacing', primitiveCssEntries.filter((entry) => entry.name.startsWith('space-'))),
  ...section('Radius', primitiveCssEntries.filter((entry) => entry.name.startsWith('radius-'))),
  ...section('Border widths', primitiveCssEntries.filter((entry) => entry.name.startsWith('border-'))),
  ...section('Opacity', primitiveCssEntries.filter((entry) => entry.name.startsWith('opacity-'))),
  ...section('Sizes', primitiveCssEntries.filter((entry) => entry.name.startsWith('control-') || entry.name.startsWith('icon-'))),
  ...section('Layout', primitiveCssEntries.filter((entry) => entry.name.startsWith('container-') || entry.name.startsWith('gutter-') || entry.name.startsWith('grid-gap-'))),
  ...section('Shadows', primitiveCssEntries.filter((entry) => entry.name.startsWith('shadow-'))),
  ...section('Motion', primitiveCssEntries.filter((entry) => entry.name.startsWith('duration-') || entry.name.startsWith('easing-'))),
  ...section('Z-Index', primitiveCssEntries.filter((entry) => entry.name.startsWith('z-'))),
  ...section('Breakpoints', primitiveCssEntries.filter((entry) => entry.name.startsWith('bp-'))),
  ...section('Semantic (light)', semanticLightNonTypeEntries),
  '}',
  '',
  ...themeBlock('[data-theme="dark"]', 'dark', semanticDarkThemeEntries),
  ...themeBlock('[data-theme="high-contrast"]', 'high-contrast', semanticHighContrastThemeEntries),
  ...mediaBlock('(prefers-color-scheme: dark)', ':root:not([data-theme])', 'dark (system)', semanticDarkThemeEntries),
  ...mediaBlock('(prefers-contrast: more)', ':root:not([data-theme])', 'high-contrast (system)', semanticHighContrastThemeEntries),
];

const primitivesOut = {};
const semanticOut = semanticLight.semanticOut;
const semanticThemesOut = {
  light: semanticLight.semanticOut,
  dark: semanticDark.semanticOut,
  highContrast: semanticHighContrast.semanticOut,
};
const cssVars = { primitives: {}, semantic: {} };

for (const entry of primitivesFlat) {
  const value = formatValue(entry.path, entry.value);
  setNested(primitivesOut, entry.path, value);
  setNested(cssVars.primitives, entry.path, `var(--${primitiveVarName(entry.path)})`);
}

for (const entry of semanticLight.semanticFlat) {
  setNested(cssVars.semantic, entry.path, `var(--${semanticVarName(entry.path)})`);
}

const jsonOut = JSON.stringify(
  { primitives: primitivesOut, semantic: semanticOut, semanticThemes: semanticThemesOut },
  null,
  2
);
const tsOut = [
  '/* Generated by design/scripts/build-tokens.mjs. Do not edit directly. */',
  '',
  `export const primitives = ${JSON.stringify(primitivesOut, null, 2)} as const;`,
  '',
  `export const semantic = ${JSON.stringify(semanticOut, null, 2)} as const;`,
  '',
  `export const semanticThemes = ${JSON.stringify(semanticThemesOut, null, 2)} as const;`,
  '',
  `export const cssVars = ${JSON.stringify(cssVars, null, 2)} as const;`,
  '',
  'export const tokens = { primitives, semantic, semanticThemes, cssVars } as const;',
  '',
].join('\n');

const jsOut = tsOut.replace(/ as const/g, '');

const outputs = [
  { path: outCssPath, content: cssLines.join('\n') },
  { path: outJsonPath, content: jsonOut + '\n' },
  { path: outTsPath, content: tsOut },
  { path: outJsPath, content: jsOut },
];

let needsUpdate = false;

for (const output of outputs) {
  if (checkOnly) {
    const existing = fs.existsSync(output.path) ? fs.readFileSync(output.path, 'utf8') : '';
    if (existing !== output.content) {
      needsUpdate = true;
      console.error(`Outdated: ${path.relative(designDir, output.path)}`);
    }
  } else {
    fs.writeFileSync(output.path, output.content, 'utf8');
  }
}

if (checkOnly && needsUpdate) {
  process.exit(1);
}
