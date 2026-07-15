import process from 'node:process';
import { buildTokens, parseArgs } from './build-tokens.mjs';

try {
  const forwardedArgs = process.argv.slice(2);
  if (forwardedArgs.includes('--check')) {
    throw new Error('validate-tokens.mjs does not accept --check; use build-tokens.mjs --check.');
  }
  const options = parseArgs(['--validate-only', ...forwardedArgs]);
  if (options.help) {
    console.log(
      [
        'Usage: node scripts/validate-tokens.mjs [--theme <file>] [--report-contrast]',
        '',
        'Validates token schemas, layer references, theme completeness, unknown',
        'overrides, and WCAG contrast pairs without writing generated files.',
      ].join('\n')
    );
  } else {
    buildTokens(options);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
