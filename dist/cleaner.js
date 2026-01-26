import * as fs from 'fs';
import * as readline from 'readline';
import chalk from 'chalk';
import { formatBytes, LOBSTER } from './utils.js';
function deleteDirectory(dirPath) {
    fs.rmSync(dirPath, { recursive: true, force: true });
}
export async function confirmClean(items, totalSize) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        console.log();
        console.log(chalk.yellow(`  ${LOBSTER} About to delete ${items.length} items (${formatBytes(totalSize)})`));
        console.log();
        rl.question(chalk.bold('  Are you sure you want to proceed? (y/N) '), (answer) => {
            rl.close();
            const confirmed = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
            resolve(confirmed);
        });
    });
}
export async function cleanItems(items, onProgress) {
    let deleted = 0;
    let failed = 0;
    let freedSpace = 0;
    const errors = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (onProgress) {
            onProgress(item, i, items.length);
        }
        try {
            deleteDirectory(item.path);
            deleted++;
            freedSpace += item.size;
        }
        catch (err) {
            failed++;
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            errors.push({ path: item.path, error: errorMessage });
        }
    }
    return {
        deleted,
        failed,
        freedSpace,
        errors,
    };
}
