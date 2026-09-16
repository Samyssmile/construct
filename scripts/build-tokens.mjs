import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const designDir = path.resolve(scriptDir, '..');
const tokensDir = path.join(designDir, 'tokens');
const schemasDir = path.join(designDir, 'schemas');

const sourcePaths = {
  primitives: path.join(tokensDir, 'primitives.json'),
  semanticLight: path.join(tokensDir, 'semantic.light.json'),
  semanticDark: path.join(tokensDir, 'semantic.dark.json'),
  semanticHighContrast: path.join(tokensDir, 'semantic.high-contrast.json'),
  semanticHighContrastDark: path.join(tokensDir, 'semantic.high-contrast-dark.json'),
  components: path.join(tokensDir, 'components.json'),
};

const schemaPaths = {
  primitives: path.join(schemasDir, 'primitives.schema.json'),
  semantic: path.join(schemasDir, 'semantic.schema.json'),
  components: path.join(schemasDir, 'components.schema.json'),
  theme: path.join(schemasDir, 'theme.schema.json'),
};

const builtInThemeNames = new Set(['light', 'dark', 'high-contrast', 'high-contrast-dark']);

const defaultContrastPairs = [
  ...['ink', 'muted'].flatMap((foreground) =>
    ['paper', 'surface'].map((background) => ({
      name: `aperture ${foreground} on ${background}`,
      foreground: `components.aperture.${foreground}`,
      background: `components.aperture.${background}`,
      minRatio: 4.5,
    }))
  ),
  {
    name: 'aperture text on accent',
    foreground: 'components.aperture.onAccent',
    background: 'components.aperture.accent',
    minRatio: 4.5,
  },
  ...['primary', 'secondary', 'muted'].flatMap((text) =>
    ['canvas', 'surface', 'elevated'].map((background) => ({
      name: `${text} text on ${background}`,
      foreground: `semantic.color.text.${text}`,
      background: `semantic.color.background.${background}`,
      minRatio: 4.5,
    }))
  ),
  ...['primary', 'primaryHover', 'primaryActive'].map((background) => ({
    name: `text on ${background}`,
    foreground: 'semantic.color.text.onPrimary',
    background: `semantic.color.brand.${background}`,
    minRatio: 4.5,
  })),
  ...['accent', 'accentHover', 'accentActive'].map((background) => ({
    name: `text on ${background}`,
    foreground: 'semantic.color.brand.onAccent',
    background: `semantic.color.brand.${background}`,
    minRatio: 4.5,
  })),
  ...['canvas', 'surface', 'elevated'].map((background) => ({
    name: `focus ring on ${background}`,
    foreground: 'semantic.color.focus.ring',
    background: `semantic.color.background.${background}`,
    minRatio: 3,
  })),
  ...['info', 'success', 'warning', 'danger'].map((state) => ({
    name: `${state} text on ${state} surface`,
    foreground: `semantic.color.stateText.${state}`,
    background: `semantic.color.stateSurface.${state}`,
    minRatio: 4.5,
  })),
  ...['info', 'success', 'warning', 'danger'].flatMap((state) =>
    ['canvas', 'surface', 'elevated'].map((background) => ({
      name: `${state} text on ${background}`,
      foreground: `semantic.color.stateText.${state}`,
      background: `semantic.color.background.${background}`,
      minRatio: 4.5,
    }))
  ),
  ...['primary', 'secondary'].flatMap((text) =>
    ['info', 'success', 'warning', 'danger'].map((state) => ({
      name: `${text} text on ${state} surface`,
      foreground: `semantic.color.text.${text}`,
      background: `semantic.color.stateSurface.${state}`,
      minRatio: 4.5,
    }))
  ),
  ...['info', 'success', 'warning', 'danger'].map((state) => ({
    name: `${state} fill on muted track`,
    foreground: `semantic.color.state.${state}`,
    background: 'semantic.color.background.muted',
    minRatio: 3,
  })),
  ...['canvas', 'surface', 'muted'].map((background) => ({
    name: `strong accent on ${background}`,
    foreground: 'semantic.color.brand.accentStrong',
    background: `semantic.color.background.${background}`,
    minRatio: 3,
  })),
  ...['canvas', 'surface', 'elevated'].map((background) => ({
    name: `strong border on ${background}`,
    foreground: 'semantic.color.border.strong',
    background: `semantic.color.background.${background}`,
    minRatio: 3,
  })),
  ...['info', 'success', 'warning', 'danger'].map((state) => ({
    name: `text on solid ${state}`,
    foreground: 'semantic.color.state.onSolid',
    background: `semantic.color.state.${state}`,
    minRatio: 4.5,
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    name: `avatar seed ${index + 1}`,
    foreground: `semantic.color.avatarSeed.${index + 1}Fg`,
    background: `semantic.color.avatarSeed.${index + 1}Bg`,
    minRatio: 4.5,
  })),
  ...Array.from({ length: 8 }, (_, index) => index + 1).flatMap((series) =>
    ['canvas', 'surface'].map((background) => ({
      name: `chart series ${series} on ${background}`,
      foreground: `semantic.color.chartSeries.${series}`,
      background: `semantic.color.background.${background}`,
      minRatio: 3,
    }))
  ),
  ...['background', 'backgroundHover', 'backgroundActive'].map((background) => ({
    name: `button color on ${background}`,
    foreground: 'components.button.color',
    background: `components.button.${background}`,
    minRatio: 4.5,
  })),
  ...['canvas', 'surface', 'elevated'].map((background) => ({
    name: `control boundary on ${background}`,
    foreground: 'components.control.border',
    background: `semantic.color.background.${background}`,
    minRatio: 3,
  })),
  {
    name: 'control boundary on control background',
    foreground: 'components.control.border',
    background: 'components.control.background',
    minRatio: 3,
  },
  {
    name: 'placeholder on control background',
    foreground: 'components.control.placeholder',
    background: 'components.control.background',
    minRatio: 4.5,
  },
];

const fontFallbacks = {
  brand: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
  text: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
  mono: ['"SFMono-Regular"', 'Menlo', 'monospace'],
};

const helpText = [
  'Usage: node scripts/build-tokens.mjs [options]',
  '',
  'Builds and validates Construct primitive, semantic, and component tokens.',
  '',
  'Options:',
  '  --check                 fail when generated outputs are not up to date',
  '  --validate-only         validate contracts, references, and contrast without writing',
  '  --theme <file>          include and validate a custom theme (repeatable)',
  '  --out-dir <directory>   write outputs outside tokens/ (useful for product themes)',
  '  --report-contrast       print every measured contrast ratio',
  '  -h, --help              show this help',
  '',
  'A custom theme must conform to schemas/theme.schema.json. It extends one of',
  'the built-in themes and may override only known semantic/component paths.',
].join('\n');

const parseArgs = (argv) => {
  const options = {
    check: false,
    validateOnly: false,
    reportContrast: false,
    themes: [],
    outDir: tokensDir,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check') {
      options.check = true;
    } else if (argument === '--validate-only') {
      options.validateOnly = true;
    } else if (argument === '--report-contrast') {
      options.reportContrast = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else if (argument === '--theme' || argument === '--out-dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${argument} requires a value.`);
      }
      index += 1;
      if (argument === '--theme') {
        options.themes.push(path.resolve(process.cwd(), value));
      } else {
        options.outDir = path.resolve(process.cwd(), value);
      }
    } else if (argument.startsWith('--theme=')) {
      options.themes.push(path.resolve(process.cwd(), argument.slice('--theme='.length)));
    } else if (argument.startsWith('--out-dir=')) {
      options.outDir = path.resolve(process.cwd(), argument.slice('--out-dir='.length));
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  if (options.check && options.validateOnly) {
    throw new Error('--check and --validate-only cannot be used together.');
  }

  return options;
};

const readJson = (filePath) => {
  let source;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read ${path.relative(designDir, filePath)}: ${error.message}`);
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON in ${path.relative(designDir, filePath)}: ${error.message}`);
  }
};

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const formatPath = (parts) => (parts.length ? parts.join('.') : '<root>');

const resolveJsonPointer = (schema, reference) => {
  if (!reference.startsWith('#/')) {
    throw new Error(`Only local JSON Schema references are supported: ${reference}`);
  }
  return reference
    .slice(2)
    .split('/')
    .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'))
    .reduce((current, part) => current?.[part], schema);
};

const validateSchema = (value, schema, label) => {
  const errors = [];

  const visit = (candidate, rule, candidatePath, rootSchema) => {
    if (!rule || typeof rule !== 'object') return;

    if (rule.$ref) {
      const referenced = resolveJsonPointer(rootSchema, rule.$ref);
      if (!referenced) {
        errors.push(`${formatPath(candidatePath)} references missing schema ${rule.$ref}`);
        return;
      }
      visit(candidate, referenced, candidatePath, rootSchema);
    }

    if (rule.anyOf) {
      const matches = rule.anyOf.some((option) => {
        const before = errors.length;
        visit(candidate, option, candidatePath, rootSchema);
        const matched = errors.length === before;
        errors.splice(before);
        return matched;
      });
      if (!matches) {
        errors.push(`${formatPath(candidatePath)} does not match any allowed schema shape`);
        return;
      }
    }

    if (rule.enum && !rule.enum.some((entry) => Object.is(entry, candidate))) {
      errors.push(
        `${formatPath(candidatePath)} must be one of ${rule.enum.map(JSON.stringify).join(', ')}`
      );
    }

    if (rule.const !== undefined && !Object.is(rule.const, candidate)) {
      errors.push(`${formatPath(candidatePath)} must equal ${JSON.stringify(rule.const)}`);
    }

    const actualType = Array.isArray(candidate)
      ? 'array'
      : candidate === null
        ? 'null'
        : Number.isInteger(candidate)
          ? 'integer'
          : typeof candidate;
    const allowedTypes = rule.type
      ? Array.isArray(rule.type)
        ? rule.type
        : [rule.type]
      : null;
    if (allowedTypes) {
      const typeMatches = allowedTypes.some(
        (type) =>
          type === actualType ||
          (type === 'number' && (actualType === 'number' || actualType === 'integer')) ||
          (type === 'object' && isPlainObject(candidate))
      );
      if (!typeMatches) {
        errors.push(
          `${formatPath(candidatePath)} must be ${allowedTypes.join(' or ')}, got ${actualType}`
        );
        return;
      }
    }

    if (typeof candidate === 'string') {
      if (rule.minLength !== undefined && candidate.length < rule.minLength) {
        errors.push(`${formatPath(candidatePath)} must not be empty`);
      }
      if (rule.pattern && !new RegExp(rule.pattern).test(candidate)) {
        errors.push(`${formatPath(candidatePath)} does not match ${rule.pattern}`);
      }
    }

    if (typeof candidate === 'number') {
      if (rule.minimum !== undefined && candidate < rule.minimum) {
        errors.push(`${formatPath(candidatePath)} must be at least ${rule.minimum}`);
      }
      if (rule.maximum !== undefined && candidate > rule.maximum) {
        errors.push(`${formatPath(candidatePath)} must be at most ${rule.maximum}`);
      }
    }

    if (Array.isArray(candidate)) {
      if (rule.minItems !== undefined && candidate.length < rule.minItems) {
        errors.push(`${formatPath(candidatePath)} must contain at least ${rule.minItems} items`);
      }
      if (rule.items) {
        candidate.forEach((item, index) =>
          visit(item, rule.items, [...candidatePath, String(index)], rootSchema)
        );
      }
    }

    if (isPlainObject(candidate)) {
      if (rule.minProperties !== undefined && Object.keys(candidate).length < rule.minProperties) {
        errors.push(
          `${formatPath(candidatePath)} must contain at least ${rule.minProperties} properties`
        );
      }

      for (const required of rule.required ?? []) {
        if (!Object.hasOwn(candidate, required)) {
          errors.push(`${formatPath([...candidatePath, required])} is required`);
        }
      }

      for (const [key, child] of Object.entries(candidate)) {
        const propertyRule = rule.properties?.[key];
        const patternRules = Object.entries(rule.patternProperties ?? {})
          .filter(([pattern]) => new RegExp(pattern).test(key))
          .map(([, patternRule]) => patternRule);

        if (propertyRule) {
          visit(child, propertyRule, [...candidatePath, key], rootSchema);
        }
        for (const patternRule of patternRules) {
          visit(child, patternRule, [...candidatePath, key], rootSchema);
        }

        if (!propertyRule && patternRules.length === 0) {
          if (rule.additionalProperties === false) {
            errors.push(`${formatPath([...candidatePath, key])} is not allowed`);
          } else if (isPlainObject(rule.additionalProperties)) {
            visit(child, rule.additionalProperties, [...candidatePath, key], rootSchema);
          }
        }
      }
    }
  };

  visit(value, schema, [], schema);
  if (errors.length) {
    throw new Error(`${label} failed schema validation:\n- ${errors.join('\n- ')}`);
  }
};

const kebabize = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const flatten = (object, basePath = []) => {
  const entries = [];
  for (const [key, value] of Object.entries(object)) {
    const tokenPath = [...basePath, key];
    if (isPlainObject(value)) {
      entries.push(...flatten(value, tokenPath));
    } else {
      entries.push({ path: tokenPath, pathKey: tokenPath.join('.'), value });
    }
  }
  return entries;
};

const getNested = (object, tokenPath) =>
  tokenPath.reduce((current, key) => current?.[key], object);

const setNested = (target, tokenPath, value) => {
  let current = target;
  for (let index = 0; index < tokenPath.length - 1; index += 1) {
    const key = tokenPath[index];
    current[key] ??= {};
    current = current[key];
  }
  current[tokenPath[tokenPath.length - 1]] = value;
};

const mergeDeep = (base, override) => {
  if (override === undefined) return base;
  if (!isPlainObject(override)) return override;
  const output = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(override)) {
    output[key] = isPlainObject(value) && isPlainObject(base?.[key])
      ? mergeDeep(base[key], value)
      : value;
  }
  return output;
};

const assertKnownOverride = (override, contract, label, basePath = []) => {
  for (const [key, value] of Object.entries(override)) {
    const tokenPath = [...basePath, key];
    if (!Object.hasOwn(contract, key)) {
      throw new Error(`${label} contains unknown token ${formatPath(tokenPath)}.`);
    }
    const expected = contract[key];
    if (isPlainObject(expected)) {
      if (!isPlainObject(value)) {
        throw new Error(`${label} must provide an object at ${formatPath(tokenPath)}.`);
      }
      assertKnownOverride(value, expected, label, tokenPath);
    } else if (isPlainObject(value)) {
      throw new Error(`${label} must provide a token value at ${formatPath(tokenPath)}.`);
    }
  }
};

const assertCompleteShape = (candidate, contract, label) => {
  const expectedPaths = flatten(contract).map(({ pathKey }) => pathKey).sort();
  const actualPaths = flatten(candidate).map(({ pathKey }) => pathKey).sort();
  if (
    expectedPaths.length !== actualPaths.length ||
    expectedPaths.some((tokenPath, index) => tokenPath !== actualPaths[index])
  ) {
    const expected = new Set(expectedPaths);
    const actual = new Set(actualPaths);
    const missing = expectedPaths.filter((tokenPath) => !actual.has(tokenPath));
    const unknown = actualPaths.filter((tokenPath) => !expected.has(tokenPath));
    throw new Error(
      [
        `${label} does not satisfy the complete token contract.`,
        missing.length ? `Missing: ${missing.join(', ')}` : null,
        unknown.length ? `Unknown: ${unknown.join(', ')}` : null,
      ]
        .filter(Boolean)
        .join(' ')
    );
  }
};

const parseReference = (value) => {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+)\}$/);
  return match ? match[1].split('.') : null;
};

const unsafeCssLiteralPattern = /[;{}]|\/\*|\*\/|!\s*important|\b(?:url|var)\s*\(|[\u0000-\u001F\u007F]/i;

const assertBalancedCssLiteral = (value, label) => {
  const stack = [];
  let quote = null;
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '(' || character === '[') stack.push(character);
    if (character === ')' || character === ']') {
      const expected = character === ')' ? '(' : '[';
      if (stack.pop() !== expected) {
        throw new Error(`${label} contains unbalanced CSS delimiters.`);
      }
    }
  }
  if (escaped || quote || stack.length) {
    throw new Error(`${label} contains unbalanced CSS delimiters.`);
  }
};

const assertSafeOverrideValues = (override, label, basePath = []) => {
  for (const [key, value] of Object.entries(override)) {
    const tokenPath = [...basePath, key];
    if (isPlainObject(value)) {
      assertSafeOverrideValues(value, label, tokenPath);
      continue;
    }
    if (typeof value !== 'string') continue;
    if (parseReference(value)) continue;
    const tokenLabel = `${label}.${formatPath(tokenPath)}`;
    if (value.trim() !== value || unsafeCssLiteralPattern.test(value)) {
      throw new Error(`${tokenLabel} contains an unsafe CSS token literal.`);
    }
    assertBalancedCssLiteral(value, tokenLabel);
  }
};

const primitiveVarName = (tokenPath) => {
  const [group, subgroup, key] = tokenPath;
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
  if (group === 'layout' && subgroup === 'navbar') return `navbar-${kebabize(key)}`;
  if (group === 'shadow') return `shadow-${kebabize(subgroup)}`;
  if (group === 'motion' && subgroup === 'duration') return `duration-${kebabize(key)}`;
  if (group === 'motion' && subgroup === 'easing') return `easing-${kebabize(key)}`;
  if (group === 'zIndex') return `z-${kebabize(subgroup)}`;
  if (group === 'breakpoint') return `bp-${kebabize(subgroup)}`;
  return tokenPath.map(kebabize).join('-');
};

const semanticVarName = (tokenPath) => {
  const [group, subgroup, key] = tokenPath;
  if (group === 'typography') return `type-${kebabize(subgroup)}-${kebabize(key)}`;
  if (group === 'color') {
    if (subgroup === 'background') return `color-bg-${kebabize(key)}`;
    if (subgroup === 'stateSurface') return `color-state-${kebabize(key)}-surface`;
    if (subgroup === 'stateBorder') return `color-state-${kebabize(key)}-border`;
    if (subgroup === 'stateText') return `color-state-${kebabize(key)}-text`;
    if (subgroup === 'focus') return `color-focus-${kebabize(key)}`;
    if (subgroup === 'overlay') return `color-overlay-${kebabize(key)}`;
    return `color-${kebabize(subgroup)}-${kebabize(key)}`;
  }
  if (group === 'font' && subgroup === 'family') return `font-family-${kebabize(key)}`;
  if (group === 'radius') return `radius-${kebabize(subgroup)}`;
  if (group === 'shadow') return `shadow-${kebabize(subgroup)}`;
  return tokenPath.map(kebabize).join('-');
};

const componentVarName = (tokenPath) =>
  `component-${tokenPath.map(kebabize).join('-')}`;

const inferPrimitiveUnit = (tokenPath) => {
  const [group, subgroup] = tokenPath;
  if (group === 'font') {
    /* Type scale in rem so user browser font-size preferences are honored
       (1.4.4); source values stay authored in px and are divided by 16. */
    if (subgroup === 'size' || subgroup === 'lineHeight') return 'rem';
    if (subgroup === 'letterSpacing') return 'px';
    return '';
  }
  if (['space', 'radius', 'border', 'size', 'layout', 'breakpoint'].includes(group)) {
    return 'px';
  }
  if (group === 'motion' && subgroup === 'duration') return 'ms';
  return '';
};

const formatPrimitiveValue = (tokenPath, value) => {
  if (typeof value === 'number') {
    const unit = inferPrimitiveUnit(tokenPath);
    if (unit === 'rem') return `${Number((value / 16).toFixed(4))}rem`;
    return unit ? `${value}${unit}` : String(value);
  }
  if (tokenPath[0] === 'font' && tokenPath[1] === 'family') {
    if (value.includes(',')) return value;
    const quoted = value.startsWith('"') || value.startsWith("'") ? value : `"${value}"`;
    return [quoted, ...(fontFallbacks[tokenPath[2]] ?? [])].join(', ');
  }
  return value;
};

const buildLayer = ({ raw, name, variableName, dependencies = [], formatValue = (_, value) => value }) => {
  const entries = flatten(raw);
  const rawByPath = new Map(entries.map((entry) => [entry.pathKey, entry]));
  const variableByPath = new Map(
    entries.map((entry) => [entry.pathKey, variableName(entry.path)])
  );
  const resolvedByPath = new Map();
  const resolving = new Set();

  const findDependency = (pathKey) =>
    dependencies.find((dependency) => dependency.resolvedByPath.has(pathKey));

  const resolveValue = (pathKey) => {
    if (resolvedByPath.has(pathKey)) return resolvedByPath.get(pathKey);
    if (resolving.has(pathKey)) {
      throw new Error(`Circular ${name} token reference at ${pathKey}.`);
    }
    const entry = rawByPath.get(pathKey);
    if (!entry) throw new Error(`Unknown ${name} token ${pathKey}.`);
    resolving.add(pathKey);
    const reference = parseReference(entry.value);
    let value;
    if (reference) {
      const referenceKey = reference.join('.');
      if (rawByPath.has(referenceKey)) {
        value = resolveValue(referenceKey);
      } else {
        const dependency = findDependency(referenceKey);
        if (!dependency) {
          throw new Error(
            `Unknown token reference ${entry.value} in ${name}.${entry.pathKey}.`
          );
        }
        value = dependency.resolvedByPath.get(referenceKey);
      }
    } else {
      value = formatValue(entry.path, entry.value);
    }
    resolving.delete(pathKey);
    resolvedByPath.set(pathKey, value);
    return value;
  };

  const cssEntries = entries.map((entry) => {
    const reference = parseReference(entry.value);
    let value;
    if (reference) {
      const referenceKey = reference.join('.');
      const ownVariable = variableByPath.get(referenceKey);
      const dependency = dependencies.find((item) => item.variableByPath.has(referenceKey));
      const referencedVariable = ownVariable ?? dependency?.variableByPath.get(referenceKey);
      if (!referencedVariable) {
        throw new Error(
          `Unknown token reference ${entry.value} in ${name}.${entry.pathKey}.`
        );
      }
      value = `var(--${referencedVariable})`;
    } else {
      value = formatValue(entry.path, entry.value);
    }
    resolveValue(entry.pathKey);
    return {
      ...entry,
      name: variableByPath.get(entry.pathKey),
      value,
    };
  });

  const resolved = {};
  const cssVars = {};
  for (const entry of entries) {
    setNested(resolved, entry.path, resolveValue(entry.pathKey));
    setNested(cssVars, entry.path, `var(--${variableByPath.get(entry.pathKey)})`);
  }

  return {
    name,
    raw,
    entries,
    rawByPath,
    variableByPath,
    resolvedByPath,
    resolved,
    cssVars,
    cssEntries,
  };
};

const cssDiffEntries = (baseLayer, themeLayer) =>
  themeLayer.cssEntries.filter((entry) => {
    const baseEntry = baseLayer.rawByPath.get(entry.pathKey);
    const themeEntry = themeLayer.rawByPath.get(entry.pathKey);
    return !baseEntry || !themeEntry || !Object.is(baseEntry.value, themeEntry.value);
  });

const parseCssColor = (value, tokenLabel) => {
  if (typeof value !== 'string') {
    throw new Error(`${tokenLabel} resolves to a non-color value: ${JSON.stringify(value)}.`);
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'white') return [255, 255, 255, 1];
  if (normalized === 'black') return [0, 0, 0, 1];

  const hex = normalized.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) digits = [...digits].map((digit) => digit + digit).join('');
    const hasAlpha = digits.length === 8;
    return [
      Number.parseInt(digits.slice(0, 2), 16),
      Number.parseInt(digits.slice(2, 4), 16),
      Number.parseInt(digits.slice(4, 6), 16),
      hasAlpha ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1,
    ];
  }

  const rgb = normalized.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (rgb) {
    const color = rgb.slice(1, 4).map(Number);
    const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
    if (color.some((channel) => channel < 0 || channel > 255) || alpha < 0 || alpha > 1) {
      throw new Error(`${tokenLabel} contains an out-of-range RGB color: ${value}.`);
    }
    return [...color, alpha];
  }

  throw new Error(
    `${tokenLabel} uses unsupported color syntax ${JSON.stringify(value)}; use hex, rgb(), or rgba() so contrast can be verified.`
  );
};

const cssLengthPattern = /^-?(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|ch|ex|cap|ic|lh|rlh|vw|vh|vmin|vmax|%))$/i;
const cssNumberPattern = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;
const isNonNegativeCssLength = (value) =>
  typeof value === 'string' && cssLengthPattern.test(value) && Number.parseFloat(value) >= 0;
const isPositiveCssLength = (value) =>
  typeof value === 'string' && cssLengthPattern.test(value) && Number.parseFloat(value) > 0;
const isPositiveCssNumber = (value) =>
  typeof value === 'string' && cssNumberPattern.test(value) && Number.parseFloat(value) > 0;

const splitCssTopLevel = (value, separator) => {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      current += character;
      escaped = true;
      continue;
    }
    if (quote) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      current += character;
      quote = character;
      continue;
    }
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (character === separator && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }
  parts.push(current.trim());
  return parts;
};

const tokenizeCssWhitespace = (value) => {
  const tokens = [];
  let current = '';
  let depth = 0;
  let quote = null;
  for (const character of value) {
    if (quote) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      current += character;
      quote = character;
      continue;
    }
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (/\s/.test(character) && depth === 0) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  if (current) tokens.push(current);
  return tokens;
};

const validateCssShadow = (value, label) => {
  if (value === 'none') return;
  for (const shadow of splitCssTopLevel(value, ',')) {
    const rawTokens = tokenizeCssWhitespace(shadow);
    const insetCount = rawTokens.filter((token) => token.toLowerCase() === 'inset').length;
    if (insetCount > 1) {
      throw new Error(`${label} must resolve to a valid CSS box-shadow value.`);
    }
    const tokens = rawTokens.filter((token) => token.toLowerCase() !== 'inset');
    if (tokens.length && !cssLengthPattern.test(tokens[0])) {
      parseCssColor(tokens.shift(), label);
    } else if (tokens.length && !cssLengthPattern.test(tokens.at(-1))) {
      parseCssColor(tokens.pop(), label);
    }
    const hasValidOffsets =
      tokens.length >= 2 &&
      tokens.length <= 4 &&
      tokens.every((token) => cssLengthPattern.test(token));
    const hasValidBlur = tokens.length < 3 || isNonNegativeCssLength(tokens[2]);
    if (!hasValidOffsets || !hasValidBlur) {
      throw new Error(`${label} must resolve to a valid CSS box-shadow value.`);
    }
  }
};

const componentColorPaths = new Set([
  ...['paper', 'surface', 'ink', 'muted', 'accent', 'onAccent', 'border'].map((name) => `aperture.${name}`),
  'button.background',
  'button.backgroundHover',
  'button.backgroundActive',
  'button.border',
  'button.color',
  'control.background',
  'control.backgroundHover',
  'control.backgroundDisabled',
  'control.border',
  'control.borderHover',
  'control.borderFocus',
  'control.text',
  'control.placeholder',
  'card.background',
  'card.border',
  'metric.background',
  'metric.border',
  'meter.track',
]);

const componentLengthPaths = new Set([
  'aperture.markSize',
  'aperture.actionHeight',
  'aperture.panelRadius',
  'button.height',
  'button.paddingX',
  'button.fontSize',
  'button.lineHeight',
  'button.radius',
  'button.gap',
  'button.loadingSpinnerSize',
  'control.radius',
  'card.radius',
  'card.padding',
  'status.gap',
  'status.fontSize',
  'status.iconSize',
  'metric.radius',
  'metric.padding',
  'metric.valueFontSize',
  'metric.labelFontSize',
  'meter.height',
  'meter.radius',
]);

const componentPositiveLengthPaths = new Set([
  'aperture.markSize',
  'aperture.actionHeight',
  'button.height',
  'button.fontSize',
  'button.lineHeight',
  'button.loadingSpinnerSize',
  'status.fontSize',
  'status.iconSize',
  'metric.valueFontSize',
  'metric.labelFontSize',
  'meter.height',
]);

const validateResolvedThemeValues = (theme) => {
  for (const entry of flatten(theme.semanticLayer.resolved)) {
    const label = `Theme ${theme.name} semantic.${entry.pathKey}`;
    if (entry.path[0] === 'color') parseCssColor(entry.value, label);
    if (entry.path[0] === 'radius' && !isNonNegativeCssLength(entry.value)) {
      throw new Error(`${label} must resolve to a non-negative CSS length.`);
    }
    if (
      entry.path[0] === 'typography' &&
      entry.path.at(-1) === 'fontSize' &&
      !isPositiveCssLength(entry.value)
    ) {
      throw new Error(`${label} must resolve to a positive CSS length.`);
    }
    if (
      entry.path[0] === 'typography' &&
      entry.path.at(-1) === 'letterSpacing' &&
      !cssLengthPattern.test(entry.value)
    ) {
      throw new Error(`${label} must resolve to a CSS length.`);
    }
    if (entry.path[0] === 'typography' && entry.path.at(-1) === 'lineHeight') {
      if (!isPositiveCssLength(entry.value) && !isPositiveCssNumber(entry.value)) {
        throw new Error(`${label} must resolve to a positive CSS length or number.`);
      }
    }
    if (entry.path[0] === 'typography' && entry.path.at(-1) === 'fontWeight') {
      if (!/^\d{1,4}$/.test(entry.value) || Number(entry.value) < 1 || Number(entry.value) > 1000) {
        throw new Error(`${label} must resolve to a numeric CSS font weight.`);
      }
    }
    if (entry.path[0] === 'shadow') validateCssShadow(entry.value, label);
  }

  for (const entry of flatten(theme.componentLayer.resolved)) {
    const label = `Theme ${theme.name} components.${entry.pathKey}`;
    if (componentColorPaths.has(entry.pathKey)) parseCssColor(entry.value, label);
    if (
      componentLengthPaths.has(entry.pathKey) &&
      !isNonNegativeCssLength(entry.value)
    ) {
      throw new Error(`${label} must resolve to a non-negative CSS length.`);
    }
    if (
      componentPositiveLengthPaths.has(entry.pathKey) &&
      !isPositiveCssLength(entry.value)
    ) {
      throw new Error(`${label} must resolve to a positive CSS length.`);
    }
    if (entry.pathKey === 'button.fontWeight') {
      if (!/^\d{1,4}$/.test(entry.value) || Number(entry.value) < 1 || Number(entry.value) > 1000) {
        throw new Error(`${label} must resolve to a numeric CSS font weight.`);
      }
    }
    if (entry.pathKey === 'card.shadow' || entry.pathKey === 'card.shadowHover') {
      validateCssShadow(entry.value, label);
    }
  }
};

const composite = (foreground, background) => {
  const alpha = foreground[3];
  return [
    foreground[0] * alpha + background[0] * (1 - alpha),
    foreground[1] * alpha + background[1] * (1 - alpha),
    foreground[2] * alpha + background[2] * (1 - alpha),
    1,
  ];
};

const relativeLuminance = ([red, green, blue]) => {
  const channels = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
};

const resolveContrastPath = (tokenPath, primitiveLayer, semanticLayer, componentLayer) => {
  const parts = tokenPath.split('.');
  const requestedLayer = ['primitives', 'semantic', 'components'].includes(parts[0])
    ? parts.shift()
    : 'semantic';
  const layer = {
    primitives: primitiveLayer,
    semantic: semanticLayer,
    components: componentLayer,
  }[requestedLayer];
  const value = getNested(layer.resolved, parts);
  if (value === undefined) {
    throw new Error(`Contrast pair references unknown token ${tokenPath}.`);
  }
  return value;
};

const validateContrast = ({
  themeName,
  primitiveLayer,
  semanticLayer,
  componentLayer,
  pairs,
  report,
}) => {
  const failures = [];
  const results = [];
  for (const pair of pairs) {
    const foregroundValue = resolveContrastPath(
      pair.foreground,
      primitiveLayer,
      semanticLayer,
      componentLayer
    );
    const backgroundValue = resolveContrastPath(
      pair.background,
      primitiveLayer,
      semanticLayer,
      componentLayer
    );
    let foreground = parseCssColor(foregroundValue, pair.foreground);
    const background = parseCssColor(backgroundValue, pair.background);
    if (background[3] !== 1) {
      throw new Error(
        `${pair.background} must resolve to an opaque color for deterministic contrast checks.`
      );
    }
    if (foreground[3] !== 1) foreground = composite(foreground, background);
    const ratio = contrastRatio(foreground, background);
    results.push({ ...pair, ratio });
    if (ratio + Number.EPSILON < pair.minRatio) {
      failures.push(`${pair.name}: ${ratio.toFixed(2)}:1 < ${pair.minRatio}:1`);
    }
  }
  if (report) {
    for (const result of results) {
      console.log(
        `${themeName}: ${result.name} ${result.ratio.toFixed(2)}:1 (min ${result.minRatio}:1)`
      );
    }
  }
  if (failures.length) {
    throw new Error(`Theme ${themeName} fails contrast validation:\n- ${failures.join('\n- ')}`);
  }
  return results;
};

const section = (label, entries, indent = 2) => {
  if (!entries.length) return [];
  const padding = ' '.repeat(indent);
  return [
    `${padding}/* ${label} */`,
    ...entries.map((entry) => `${padding}--${entry.name}: ${entry.value};`),
  ];
};

const themeBlock = (selector, label, semanticEntries, componentEntries) => {
  const contents = [
    ...section(`Semantic (${label})`, semanticEntries),
    ...section(`Component (${label})`, componentEntries),
  ];
  if (!contents.length) return [];
  return [`${selector} {`, '  color-scheme: var(--theme-color-scheme);', ...contents, '}', ''];
};

const mediaBlock = (query, selector, label, semanticEntries, componentEntries) => {
  const contents = [
    ...section(`Semantic (${label})`, semanticEntries, 4),
    ...section(`Component (${label})`, componentEntries, 4),
  ];
  if (!contents.length) return [];
  return [`@media ${query} {`, `  ${selector} {`, ...contents, '  }', '}', ''];
};

const buildTokens = (options) => {
  const primitives = readJson(sourcePaths.primitives);
  const semanticLightRaw = readJson(sourcePaths.semanticLight);
  const semanticDarkOverride = readJson(sourcePaths.semanticDark);
  const semanticHighContrastOverride = readJson(sourcePaths.semanticHighContrast);
  const semanticHighContrastDarkOverride = readJson(sourcePaths.semanticHighContrastDark);
  const componentsRaw = readJson(sourcePaths.components);

  const schemas = Object.fromEntries(
    Object.entries(schemaPaths).map(([name, filePath]) => [name, readJson(filePath)])
  );

  validateSchema(primitives, schemas.primitives, 'tokens/primitives.json');
  validateSchema(semanticLightRaw, schemas.semantic, 'tokens/semantic.light.json');
  validateSchema(componentsRaw, schemas.components, 'tokens/components.json');

  assertKnownOverride(
    semanticDarkOverride,
    semanticLightRaw,
    'tokens/semantic.dark.json'
  );
  assertKnownOverride(
    semanticHighContrastOverride,
    semanticLightRaw,
    'tokens/semantic.high-contrast.json'
  );
  assertKnownOverride(
    semanticHighContrastDarkOverride,
    semanticLightRaw,
    'tokens/semantic.high-contrast-dark.json'
  );

  const semanticBuiltInRaw = {
    light: semanticLightRaw,
    dark: mergeDeep(semanticLightRaw, semanticDarkOverride),
    'high-contrast': mergeDeep(semanticLightRaw, semanticHighContrastOverride),
    'high-contrast-dark': mergeDeep(semanticLightRaw, semanticHighContrastDarkOverride),
  };

  for (const [name, semanticRaw] of Object.entries(semanticBuiltInRaw)) {
    assertCompleteShape(semanticRaw, semanticLightRaw, `Built-in theme ${name}`);
    validateSchema(semanticRaw, schemas.semantic, `Built-in theme ${name}`);
  }

  const primitiveLayer = buildLayer({
    raw: primitives,
    name: 'primitives',
    variableName: primitiveVarName,
    formatValue: formatPrimitiveValue,
  });

  const buildThemeLayers = (name, semanticRaw, componentRaw) => {
    const semanticLayer = buildLayer({
      raw: semanticRaw,
      name: `semantic theme ${name}`,
      variableName: semanticVarName,
      dependencies: [primitiveLayer],
    });
    const componentLayer = buildLayer({
      raw: componentRaw,
      name: `component theme ${name}`,
      variableName: componentVarName,
      dependencies: [semanticLayer, primitiveLayer],
    });
    return { semanticLayer, componentLayer };
  };

  const builtInThemes = {
    light: {
      name: 'light',
      selector: '[data-theme="light"]',
      semanticRaw: semanticBuiltInRaw.light,
      componentRaw: componentsRaw,
      ...buildThemeLayers('light', semanticBuiltInRaw.light, componentsRaw),
    },
    dark: {
      name: 'dark',
      selector: '[data-theme="dark"]',
      semanticRaw: semanticBuiltInRaw.dark,
      componentRaw: componentsRaw,
      ...buildThemeLayers('dark', semanticBuiltInRaw.dark, componentsRaw),
    },
    'high-contrast': {
      name: 'high-contrast',
      selector: '[data-theme="high-contrast"]',
      semanticRaw: semanticBuiltInRaw['high-contrast'],
      componentRaw: componentsRaw,
      ...buildThemeLayers('high-contrast', semanticBuiltInRaw['high-contrast'], componentsRaw),
    },
    'high-contrast-dark': {
      name: 'high-contrast-dark',
      selector: '[data-theme="high-contrast-dark"]',
      semanticRaw: semanticBuiltInRaw['high-contrast-dark'],
      componentRaw: componentsRaw,
      ...buildThemeLayers(
        'high-contrast-dark',
        semanticBuiltInRaw['high-contrast-dark'],
        componentsRaw
      ),
    },
  };

  const customThemes = options.themes.map((themePath) => {
    const theme = readJson(themePath);
    const relativeThemePath = path.relative(designDir, themePath);
    if (isPlainObject(theme.semantic)) {
      assertSafeOverrideValues(theme.semantic, `${relativeThemePath}.semantic`);
    }
    if (isPlainObject(theme.components)) {
      assertSafeOverrideValues(theme.components, `${relativeThemePath}.components`);
    }
    validateSchema(theme, schemas.theme, relativeThemePath);
    if (builtInThemeNames.has(theme.name)) {
      throw new Error(`${relativeThemePath} cannot replace built-in theme ${theme.name}.`);
    }
    const extendsName = theme.extends ?? 'light';
    const semanticOverride = theme.semantic ?? {};
    const componentOverride = theme.components ?? {};
    assertKnownOverride(semanticOverride, semanticLightRaw, relativeThemePath);
    assertKnownOverride(componentOverride, componentsRaw, relativeThemePath);
    const semanticRaw = mergeDeep(semanticBuiltInRaw[extendsName], semanticOverride);
    const componentRaw = mergeDeep(componentsRaw, componentOverride);
    assertCompleteShape(semanticRaw, semanticLightRaw, `Custom theme ${theme.name}`);
    assertCompleteShape(componentRaw, componentsRaw, `Custom theme ${theme.name}`);
    validateSchema(semanticRaw, schemas.semantic, `Custom theme ${theme.name} semantic tokens`);
    validateSchema(componentRaw, schemas.components, `Custom theme ${theme.name} component tokens`);
    return {
      name: theme.name,
      selector: theme.selector ?? `[data-theme="${theme.name}"]`,
      extends: extendsName,
      semanticRaw,
      componentRaw,
      contrast: theme.contrast ?? [],
      source: relativeThemePath,
      ...buildThemeLayers(theme.name, semanticRaw, componentRaw),
    };
  });

  const allThemes = [...Object.values(builtInThemes), ...customThemes];
  const seenNames = new Set();
  const seenSelectors = new Set();
  for (const theme of allThemes) {
    if (seenNames.has(theme.name)) throw new Error(`Duplicate theme name ${theme.name}.`);
    if (seenSelectors.has(theme.selector)) {
      throw new Error(`Duplicate theme selector ${theme.selector}.`);
    }
    seenNames.add(theme.name);
    seenSelectors.add(theme.selector);
    validateResolvedThemeValues(theme);
    theme.contrastResults = validateContrast({
      themeName: theme.name,
      primitiveLayer,
      semanticLayer: theme.semanticLayer,
      componentLayer: theme.componentLayer,
      pairs: [...defaultContrastPairs, ...(theme.contrast ?? [])],
      report: options.reportContrast,
    });
  }

  const lightTheme = builtInThemes.light;
  const darkSemanticDiff = cssDiffEntries(lightTheme.semanticLayer, builtInThemes.dark.semanticLayer);
  const darkSemanticEntries = builtInThemes.dark.semanticLayer.cssEntries;
  const darkComponentEntries = builtInThemes.dark.componentLayer.cssEntries;
  const highContrastSemanticEntries =
    builtInThemes['high-contrast'].semanticLayer.cssEntries;
  const highContrastComponentEntries = builtInThemes['high-contrast'].componentLayer.cssEntries;
  const highContrastDarkSemanticEntries =
    builtInThemes['high-contrast-dark'].semanticLayer.cssEntries;
  const highContrastDarkComponentEntries =
    builtInThemes['high-contrast-dark'].componentLayer.cssEntries;

  const primitiveEntries = primitiveLayer.cssEntries;
  const semanticEntries = lightTheme.semanticLayer.cssEntries;
  const componentEntries = lightTheme.componentLayer.cssEntries;
  const semanticTypographyEntries = semanticEntries.filter((entry) =>
    entry.name.startsWith('type-')
  );
  const semanticNonTypographyEntries = semanticEntries.filter(
    (entry) => !entry.name.startsWith('type-')
  );

  const customThemeBlocks = customThemes.flatMap((theme) =>
    themeBlock(
      theme.selector,
      theme.name,
      theme.semanticLayer.cssEntries,
      theme.componentLayer.cssEntries
    )
  );

  const cssLines = [
    '/* Generated by scripts/build-tokens.mjs. Do not edit directly. */',
    ':root {',
    ...section(
      'Primitive: colors',
      primitiveEntries.filter((entry) => entry.name.startsWith('color-'))
    ),
    ...section(
      'Primitive: typography',
      primitiveEntries.filter(
        (entry) =>
          entry.name.startsWith('font-') ||
          entry.name.startsWith('line-height-') ||
          entry.name.startsWith('letter-spacing-')
      )
    ),
    ...section('Semantic: typography', semanticTypographyEntries),
    ...section(
      'Primitive: spacing',
      primitiveEntries.filter((entry) => entry.name.startsWith('space-'))
    ),
    ...section(
      'Primitive: radius',
      primitiveEntries.filter((entry) => entry.name.startsWith('radius-'))
    ),
    ...section(
      'Primitive: border widths',
      primitiveEntries.filter((entry) => entry.name.startsWith('border-'))
    ),
    ...section(
      'Primitive: opacity',
      primitiveEntries.filter((entry) => entry.name.startsWith('opacity-'))
    ),
    ...section(
      'Primitive: sizes',
      primitiveEntries.filter(
        (entry) => entry.name.startsWith('control-') || entry.name.startsWith('icon-')
      )
    ),
    ...section(
      'Primitive: layout',
      primitiveEntries.filter(
        (entry) =>
          entry.name.startsWith('container-') ||
          entry.name.startsWith('gutter-') ||
          entry.name.startsWith('grid-gap-') ||
          entry.name.startsWith('navbar-')
      )
    ),
    ...section(
      'Primitive: shadows',
      primitiveEntries.filter((entry) => entry.name.startsWith('shadow-'))
    ),
    ...section(
      'Primitive: motion',
      primitiveEntries.filter(
        (entry) => entry.name.startsWith('duration-') || entry.name.startsWith('easing-')
      )
    ),
    ...section(
      'Primitive: z-index',
      primitiveEntries.filter((entry) => entry.name.startsWith('z-'))
    ),
    ...section(
      'Primitive: breakpoints',
      primitiveEntries.filter((entry) => entry.name.startsWith('bp-'))
    ),
    ...section('Semantic: light', semanticNonTypographyEntries),
    ...section('Component: defaults', componentEntries),
    '}',
    '',
    ...themeBlock(
      builtInThemes.light.selector,
      'light',
      lightTheme.semanticLayer.cssEntries,
      lightTheme.componentLayer.cssEntries
    ),
    ...themeBlock(
      builtInThemes.dark.selector,
      'dark',
      darkSemanticEntries,
      darkComponentEntries
    ),
    ...themeBlock(
      builtInThemes['high-contrast'].selector,
      'high-contrast',
      highContrastSemanticEntries,
      highContrastComponentEntries
    ),
    ...themeBlock(
      builtInThemes['high-contrast-dark'].selector,
      'high-contrast-dark',
      highContrastDarkSemanticEntries,
      highContrastDarkComponentEntries
    ),
    ...customThemeBlocks,
    ...mediaBlock(
      '(prefers-color-scheme: dark)',
      ':root:not([data-theme])',
      'dark (system)',
      darkSemanticDiff,
      []
    ),
    ...mediaBlock(
      '(prefers-contrast: more)',
      ':root:not([data-theme])',
      'high-contrast (system)',
      highContrastSemanticEntries,
      highContrastComponentEntries
    ),
    /* Emitted after the light high-contrast block so it wins the cascade
       when both prefers-contrast: more and a dark color scheme match —
       dark-mode users asking for more contrast keep a dark UI. */
    ...mediaBlock(
      '(prefers-contrast: more) and (prefers-color-scheme: dark)',
      ':root:not([data-theme])',
      'high-contrast-dark (system)',
      highContrastDarkSemanticEntries,
      highContrastDarkComponentEntries
    ),
  ];

  const semanticThemes = {};
  const componentThemes = {};
  for (const theme of allThemes) {
    const exportNames = { 'high-contrast': 'highContrast', 'high-contrast-dark': 'highContrastDark' };
    const exportName = exportNames[theme.name] ?? theme.name;
    semanticThemes[exportName] = theme.semanticLayer.resolved;
    componentThemes[exportName] = theme.componentLayer.resolved;
  }

  const metadata = {
    formatVersion: 1,
    layers: ['primitives', 'semantic', 'components'],
    themes: allThemes.map((theme) => theme.name),
  };
  const cssVars = {
    primitives: primitiveLayer.cssVars,
    semantic: lightTheme.semanticLayer.cssVars,
    components: lightTheme.componentLayer.cssVars,
  };
  const jsonObject = {
    metadata,
    primitives: primitiveLayer.resolved,
    semantic: lightTheme.semanticLayer.resolved,
    components: lightTheme.componentLayer.resolved,
    semanticThemes,
    componentThemes,
    cssVars,
  };

  const generatedComment = '/* Generated by scripts/build-tokens.mjs. Do not edit directly. */';
  const tsLines = [
    generatedComment,
    '',
    `export const tokenMetadata = ${JSON.stringify(metadata, null, 2)} as const;`,
    '',
    `export const primitives = ${JSON.stringify(primitiveLayer.resolved, null, 2)} as const;`,
    '',
    `export const semantic = ${JSON.stringify(lightTheme.semanticLayer.resolved, null, 2)} as const;`,
    '',
    `export const components = ${JSON.stringify(lightTheme.componentLayer.resolved, null, 2)} as const;`,
    '',
    `export const semanticThemes = ${JSON.stringify(semanticThemes, null, 2)} as const;`,
    '',
    `export const componentThemes = ${JSON.stringify(componentThemes, null, 2)} as const;`,
    '',
    `export const cssVars = ${JSON.stringify(cssVars, null, 2)} as const;`,
    '',
    'export const tokens = {',
    '  metadata: tokenMetadata,',
    '  primitives,',
    '  semantic,',
    '  components,',
    '  semanticThemes,',
    '  componentThemes,',
    '  cssVars,',
    '} as const;',
    '',
  ];
  const tsContent = tsLines.join('\n');
  const jsContent = tsContent.replace(/ as const/g, '');
  const outputs = [
    { name: 'tokens.css', content: cssLines.join('\n') },
    { name: 'tokens.json', content: `${JSON.stringify(jsonObject, null, 2)}\n` },
    { name: 'tokens.ts', content: tsContent },
    { name: 'tokens.js', content: jsContent },
  ];

  if (options.validateOnly) {
    console.log(
      `Validated ${flatten(primitives).length} primitive, ${flatten(semanticLightRaw).length} semantic, and ${flatten(componentsRaw).length} component tokens across ${allThemes.length} themes with ${defaultContrastPairs.length} default contrast pairs per theme.`
    );
    return { outputs, themes: allThemes };
  }

  if (!options.check) fs.mkdirSync(options.outDir, { recursive: true });
  let needsUpdate = false;
  for (const output of outputs) {
    const outputPath = path.join(options.outDir, output.name);
    if (options.check) {
      const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
      if (current !== output.content) {
        needsUpdate = true;
        console.error(`Outdated: ${path.relative(designDir, outputPath)}`);
      }
    } else {
      fs.writeFileSync(outputPath, output.content, 'utf8');
    }
  }
  if (needsUpdate) process.exitCode = 1;
  return { outputs, themes: allThemes };
};

const main = () => {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(helpText);
      return;
    }
    buildTokens(options);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main();
}

export { buildTokens, parseArgs, validateSchema };
