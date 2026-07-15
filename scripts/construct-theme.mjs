#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';

import { buildTokens, parseArgs } from './build-tokens.mjs';

const help = [
  'Usage: construct-theme --theme <file> [options]',
  '',
  'Builds Construct token outputs with one or more validated product themes.',
  '',
  'Options:',
  '  --theme <file>          custom theme input; repeat to include more themes',
  '  --out-dir <directory>   output directory (default: ./construct-theme)',
  '  --check                 fail when the output directory is not up to date',
  '  --validate-only         validate without writing output',
  '  --report-contrast       print every measured contrast ratio',
  '  -h, --help              show this help',
].join('\n');

const hasOption = (args, name) =>
  args.includes(name) || args.some((argument) => argument.startsWith(`${name}=`));

try {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    console.log(help);
  } else {
    if (!options.themes.length) {
      throw new Error('construct-theme requires at least one --theme <file> input.');
    }
    if (!hasOption(args, '--out-dir')) {
      options.outDir = path.resolve(process.cwd(), 'construct-theme');
    }
    buildTokens(options);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
