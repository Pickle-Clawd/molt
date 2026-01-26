import chalk from 'chalk';
export const LOBSTER = '🦞';
export const CRUFT_PATTERNS = [
    'node_modules',
    'dist',
    'build',
    '.cache',
    '__pycache__',
    '.next',
    '.turbo',
    'coverage',
    '.nyc_output',
    '.parcel-cache',
    '.vite',
    '.nuxt',
    '.output',
    '.svelte-kit',
    'target', // Rust
    '.tox',
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',
    'venv',
    '.venv',
    'vendor', // Go
    '.gradle',
    '.angular',
    'out',
    '.expo',
    '.docusaurus',
];
export function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(i > 0 ? 2 : 0)} ${units[i]}`;
}
export function getTypeColor(type) {
    const colors = {
        'node_modules': chalk.red,
        'dist': chalk.yellow,
        'build': chalk.yellow,
        '.cache': chalk.cyan,
        '__pycache__': chalk.magenta,
        '.next': chalk.white,
        '.turbo': chalk.blue,
        'coverage': chalk.green,
        'target': chalk.red,
        'venv': chalk.magenta,
        '.venv': chalk.magenta,
    };
    const colorFn = colors[type] || chalk.gray;
    return colorFn(type);
}
export function printBanner() {
    console.log();
    console.log(chalk.red.bold(`  ${LOBSTER} MOLT - Shed Your Project's Bloat ${LOBSTER}`));
    console.log(chalk.gray('  ─────────────────────────────────────'));
    console.log();
}
export function printScanResult(result, verbose = false) {
    if (result.items.length === 0) {
        console.log(chalk.green(`\n${LOBSTER} Your shell is already clean! No cruft found.\n`));
        return;
    }
    console.log();
    console.log(chalk.bold('  Found cruft to shed:'));
    console.log();
    // Group by type
    const grouped = new Map();
    for (const item of result.items) {
        const existing = grouped.get(item.type) || [];
        existing.push(item);
        grouped.set(item.type, existing);
    }
    for (const [type, items] of grouped) {
        const typeSize = items.reduce((sum, i) => sum + i.size, 0);
        console.log(`  ${getTypeColor(type)} (${items.length}) - ${chalk.yellow(formatBytes(typeSize))}`);
        if (verbose) {
            for (const item of items.slice(0, 5)) {
                console.log(chalk.gray(`    └─ ${item.path}`));
            }
            if (items.length > 5) {
                console.log(chalk.gray(`    └─ ... and ${items.length - 5} more`));
            }
        }
    }
    console.log();
    console.log(chalk.bold(`  📊 Summary:`));
    console.log(`     Items: ${chalk.cyan(result.items.length.toString())}`);
    console.log(`     Total: ${chalk.yellow.bold(formatBytes(result.totalSize))}`);
    console.log(`     Scanned: ${chalk.gray(result.scannedDirs.toString() + ' directories')}`);
    console.log();
}
export function printCleanResult(freedSpace, deletedCount) {
    console.log();
    console.log(chalk.green.bold(`  ${LOBSTER} Molt complete!`));
    console.log();
    console.log(`     Shed ${chalk.cyan(deletedCount.toString())} items`);
    console.log(`     Freed ${chalk.yellow.bold(formatBytes(freedSpace))}`);
    console.log();
    console.log(chalk.gray('  Your project feels lighter already!'));
    console.log();
}
export function printDryRunResult(result) {
    console.log();
    console.log(chalk.blue.bold(`  ${LOBSTER} Dry run complete (nothing deleted)`));
    console.log();
    console.log(`     Would shed ${chalk.cyan(result.items.length.toString())} items`);
    console.log(`     Would free ${chalk.yellow.bold(formatBytes(result.totalSize))}`);
    console.log();
}
export function printError(message) {
    console.error(chalk.red(`\n${LOBSTER} Error: ${message}\n`));
}
export function lobsterMessage(message) {
    return `${LOBSTER} ${message}`;
}
