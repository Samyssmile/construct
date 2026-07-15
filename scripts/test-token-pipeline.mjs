import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokens, validateSchema } from './build-tokens.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const designDir = path.resolve(scriptDir, '..');
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'construct-tokens-'));
const outputDirectory = path.join(temporaryDirectory, 'output');

const writeTheme = (name, theme) => {
  const filePath = path.join(temporaryDirectory, `${name}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(theme, null, 2)}\n`, 'utf8');
  return filePath;
};

const optionsFor = (themePath, overrides = {}) => ({
  check: false,
  validateOnly: false,
  reportContrast: false,
  themes: themePath ? [themePath] : [],
  outDir: outputDirectory,
  help: false,
  ...overrides,
});

const countLeaves = (value) =>
  Object.values(value).reduce(
    (count, child) => count + (child && typeof child === 'object' ? countLeaves(child) : 1),
    0
  );

const getThemeBlock = (css, themeName) => {
  const match = css.match(
    new RegExp(`\\[data-theme="${themeName}"\\] \\{([\\s\\S]*?)\\n\\}`, 'm')
  );
  assert.ok(match, `Missing CSS block for ${themeName}`);
  return match[1];
};

const getSystemContrastBlock = (css) => {
  const match = css.match(
    /@media \(prefers-contrast: more\) \{\n  :root:not\(\[data-theme\]\) \{([\s\S]*?)\n  \}\n\}/m
  );
  assert.ok(match, 'Missing prefers-contrast system theme block');
  return match[1];
};

try {
  const validThemePath = writeTheme('valid', {
    name: 'test-brand',
    extends: 'dark',
    semantic: {
      color: {
        brand: {
          primary: '{color.ocean.100}',
          primaryHover: '{color.ocean.50}',
          primaryActive: '{color.ocean.200}',
        },
      },
    },
    components: {
      button: {
        radius: '{radius.pill}',
      },
      card: {
        shadow: '-1px 2px 4px -2px #000000',
      },
    },
  });
  buildTokens(optionsFor(validThemePath));
  const css = fs.readFileSync(path.join(outputDirectory, 'tokens.css'), 'utf8');
  const json = JSON.parse(fs.readFileSync(path.join(outputDirectory, 'tokens.json'), 'utf8'));
  assert.match(css, /\[data-theme="test-brand"\]/);
  assert.match(css, /--component-button-radius: var\(--radius-pill\)/);
  assert.equal(json.componentThemes['test-brand'].button.radius, '999px');
  assert.equal(
    json.componentThemes['test-brand'].card.shadow,
    '-1px 2px 4px -2px #000000'
  );
  assert.deepEqual(json.metadata.layers, ['primitives', 'semantic', 'components']);
  const componentTokenCount = countLeaves(json.components);
  const explicitThemeTokenCount = countLeaves(json.semantic) + componentTokenCount;
  for (const themeName of ['light', 'dark', 'high-contrast', 'test-brand']) {
    const block = getThemeBlock(css, themeName);
    assert.match(block, /color-scheme: var\(--theme-color-scheme\)/);
    assert.equal((block.match(/--component-/g) ?? []).length, componentTokenCount);
    assert.equal((block.match(/^\s*--/gm) ?? []).length, explicitThemeTokenCount);
  }
  const systemContrastBlock = getSystemContrastBlock(css);
  assert.equal((systemContrastBlock.match(/^\s*--/gm) ?? []).length, explicitThemeTokenCount);
  assert.match(systemContrastBlock, /--color-brand-primary:/);
  assert.match(systemContrastBlock, /--theme-color-scheme:/);
  assert.match(systemContrastBlock, /--component-button-background:/);

  const unknownThemePath = writeTheme('unknown', {
    name: 'unknown-theme',
    semantic: {
      color: {
        brand: {
          invented: '#000000',
        },
      },
    },
  });
  assert.throws(
    () => buildTokens(optionsFor(unknownThemePath, { validateOnly: true })),
    /unknown token color\.brand\.invented/
  );

  const lowContrastThemePath = writeTheme('low-contrast', {
    name: 'low-contrast',
    semantic: {
      color: {
        text: {
          primary: '#FFFFFF',
        },
      },
    },
  });
  assert.throws(
    () => buildTokens(optionsFor(lowContrastThemePath, { validateOnly: true })),
    /fails contrast validation/
  );

  const missingReferencePath = writeTheme('missing-reference', {
    name: 'missing-reference',
    semantic: {
      color: {
        brand: {
          primary: '{color.brand.doesNotExist}',
        },
      },
    },
  });
  assert.throws(
    () => buildTokens(optionsFor(missingReferencePath, { validateOnly: true })),
    /Unknown token reference/
  );

  const circularReferencePath = writeTheme('circular-reference', {
    name: 'circular-reference',
    semantic: {
      color: {
        brand: {
          primary: '{color.brand.primaryHover}',
          primaryHover: '{color.brand.primary}',
        },
      },
    },
  });
  assert.throws(
    () => buildTokens(optionsFor(circularReferencePath, { validateOnly: true })),
    /Circular semantic theme circular-reference token reference/
  );

  const duplicateNameA = writeTheme('duplicate-name-a', {
    name: 'duplicate-name',
    components: { button: { radius: '{radius.pill}' } },
  });
  const duplicateNameB = writeTheme('duplicate-name-b', {
    name: 'duplicate-name',
    components: { card: { radius: '{radius.pill}' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(null, {
      themes: [duplicateNameA, duplicateNameB],
      validateOnly: true,
    })),
    /Duplicate theme name duplicate-name/
  );

  const duplicateSelectorA = writeTheme('duplicate-selector-a', {
    name: 'duplicate-selector-a',
    selector: '[data-product-theme]',
    components: { button: { radius: '{radius.pill}' } },
  });
  const duplicateSelectorB = writeTheme('duplicate-selector-b', {
    name: 'duplicate-selector-b',
    selector: '[data-product-theme]',
    components: { card: { radius: '{radius.pill}' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(null, {
      themes: [duplicateSelectorA, duplicateSelectorB],
      validateOnly: true,
    })),
    /Duplicate theme selector \[data-product-theme\]/
  );

  const unsafeSelectorPath = writeTheme('unsafe-selector', {
    name: 'unsafe-selector',
    selector: ':root/*',
    components: { button: { radius: '{radius.pill}' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(unsafeSelectorPath, { validateOnly: true })),
    /selector does not match/
  );

  const invalidSelectorPath = writeTheme('invalid-selector', {
    name: 'invalid-selector',
    selector: '[',
    components: { button: { radius: '{radius.pill}' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(invalidSelectorPath, { validateOnly: true })),
    /selector does not match/
  );

  const injectedValuePath = writeTheme('injected-value', {
    name: 'injected-value',
    components: {
      button: {
        radius: '0; } body { display: none; /*',
      },
    },
  });
  assert.throws(
    () => buildTokens(optionsFor(injectedValuePath, { validateOnly: true })),
    /components\.button\.radius contains an unsafe CSS token literal/
  );

  const invalidLengthPath = writeTheme('invalid-length', {
    name: 'invalid-length',
    components: { button: { radius: 'banana' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(invalidLengthPath, { validateOnly: true })),
    /components\.button\.radius must resolve to a non-negative CSS length/
  );

  const negativeLengthPath = writeTheme('negative-length', {
    name: 'negative-length',
    components: { button: { height: '-10px' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(negativeLengthPath, { validateOnly: true })),
    /components\.button\.height must resolve to a non-negative CSS length/
  );

  const negativeRadiusPath = writeTheme('negative-radius', {
    name: 'negative-radius',
    semantic: { radius: { control: '-2px' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(negativeRadiusPath, { validateOnly: true })),
    /semantic\.radius\.control must resolve to a non-negative CSS length/
  );

  const negativeShadowBlurPath = writeTheme('negative-shadow-blur', {
    name: 'negative-shadow-blur',
    components: { card: { shadow: '0 0 -4px #000000' } },
  });
  assert.throws(
    () => buildTokens(optionsFor(negativeShadowBlurPath, { validateOnly: true })),
    /components\.card\.shadow must resolve to a valid CSS box-shadow value/
  );

  const validateOnlyOutput = path.join(temporaryDirectory, 'validate-only-output');
  buildTokens(optionsFor(validThemePath, {
    outDir: validateOnlyOutput,
    validateOnly: true,
  }));
  assert.equal(fs.existsSync(validateOnlyOutput), false);

  const semanticSchema = JSON.parse(
    fs.readFileSync(path.join(designDir, 'schemas/semantic.schema.json'), 'utf8')
  );
  const incompleteSemantic = JSON.parse(
    fs.readFileSync(path.join(designDir, 'tokens/semantic.light.json'), 'utf8')
  );
  delete incompleteSemantic.color.background.subtle;
  assert.throws(
    () => validateSchema(incompleteSemantic, semanticSchema, 'incomplete semantic fixture'),
    /color\.background\.subtle is required/
  );

  console.log('Token pipeline tests passed.');
} finally {
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
}
