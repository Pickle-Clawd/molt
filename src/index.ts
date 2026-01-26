#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import {
  printBanner,
  printScanResult,
  printCleanResult,
  printDryRunResult,
  printError,
  LOBSTER,
  formatBytes,
} from './utils.js';
import { scanDirectory, getCruftTypes } from './scanner.js';
import { cleanItems, confirmClean } from './cleaner.js';

const program = new Command();

program
  .name('molt')
  .description(`${LOBSTER} A lobster-themed CLI disk cleanup tool - shed your project's bloat!`)
  .version('1.0.0');

program
  .command('scan')
  .description('Scan directory and show what can be cleaned')
  .argument('<dir>', 'Directory to scan')
  .option('-v, --verbose', 'Show detailed file paths', false)
  .action(async (dir: string, options: { verbose: boolean }) => {
    printBanner();

    const targetDir = path.resolve(dir);
    const spinner = ora({
      text: chalk.cyan('Shedding the shell... scanning for cruft'),
      color: 'red',
    }).start();

    try {
      const result = await scanDirectory(targetDir, (currentDir) => {
        spinner.text = chalk.cyan(`Scanning: ${currentDir.slice(0, 60)}...`);
      });

      spinner.stop();
      printScanResult(result, options.verbose);
    } catch (err) {
      spinner.stop();
      const message = err instanceof Error ? err.message : 'Unknown error';
      printError(message);
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Delete cruft directories to free up disk space')
  .argument('<dir>', 'Directory to clean')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('--dry-run', 'Show what would be deleted without actually deleting', false)
  .option('-v, --verbose', 'Show detailed output', false)
  .action(
    async (
      dir: string,
      options: { yes: boolean; dryRun: boolean; verbose: boolean }
    ) => {
      printBanner();

      const targetDir = path.resolve(dir);
      const spinner = ora({
        text: chalk.cyan('Shedding the shell... scanning for cruft'),
        color: 'red',
      }).start();

      let result;
      try {
        result = await scanDirectory(targetDir, (currentDir) => {
          spinner.text = chalk.cyan(`Scanning: ${currentDir.slice(0, 60)}...`);
        });
        spinner.stop();
      } catch (err) {
        spinner.stop();
        const message = err instanceof Error ? err.message : 'Unknown error';
        printError(message);
        process.exit(1);
      }

      if (result.items.length === 0) {
        console.log(
          chalk.green(`\n${LOBSTER} Your shell is already clean! No cruft found.\n`)
        );
        return;
      }

      printScanResult(result, options.verbose);

      if (options.dryRun) {
        printDryRunResult(result);
        return;
      }

      // Confirmation
      let confirmed = options.yes;
      if (!confirmed) {
        confirmed = await confirmClean(result.items, result.totalSize);
      }

      if (!confirmed) {
        console.log(chalk.yellow(`\n${LOBSTER} Molt cancelled. Your cruft lives another day.\n`));
        return;
      }

      // Actually delete
      const cleanSpinner = ora({
        text: chalk.cyan('Shedding cruft...'),
        color: 'red',
      }).start();

      const cleanResult = await cleanItems(result.items, (item, index, total) => {
        cleanSpinner.text = chalk.cyan(
          `Shedding cruft... (${index + 1}/${total}) ${formatBytes(item.size)}`
        );
      });

      cleanSpinner.stop();

      if (cleanResult.errors.length > 0) {
        console.log(chalk.yellow(`\n  ${LOBSTER} Some items could not be deleted:`));
        for (const err of cleanResult.errors.slice(0, 5)) {
          console.log(chalk.red(`     - ${err.path}: ${err.error}`));
        }
        if (cleanResult.errors.length > 5) {
          console.log(chalk.gray(`     ... and ${cleanResult.errors.length - 5} more errors`));
        }
      }

      printCleanResult(cleanResult.freedSpace, cleanResult.deleted);
    }
  );

program
  .command('types')
  .description('List all cruft directory types that molt looks for')
  .action(() => {
    printBanner();
    console.log(chalk.bold('  Cruft types molt looks for:\n'));
    const types = getCruftTypes();
    for (const type of types) {
      console.log(chalk.cyan(`    - ${type}`));
    }
    console.log();
  });

program.parse();

// Export for programmatic usage
export { scanDirectory } from './scanner.js';
export { cleanItems } from './cleaner.js';
export * from './utils.js';
