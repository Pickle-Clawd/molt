import * as fs from 'fs';
import * as path from 'path';
import { CRUFT_PATTERNS } from './utils.js';
function getDirectorySize(dirPath) {
    let totalSize = 0;
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            try {
                if (entry.isDirectory()) {
                    totalSize += getDirectorySize(fullPath);
                }
                else if (entry.isFile()) {
                    const stats = fs.statSync(fullPath);
                    totalSize += stats.size;
                }
            }
            catch {
                // Skip files/dirs we can't access
            }
        }
    }
    catch {
        // Skip directories we can't read
    }
    return totalSize;
}
function isCruftDirectory(name) {
    return CRUFT_PATTERNS.includes(name);
}
export async function scanDirectory(rootDir, onProgress) {
    const items = [];
    let scannedDirs = 0;
    function scan(dir, depth = 0) {
        // Limit depth to avoid scanning too deep (e.g., inside node_modules)
        if (depth > 10)
            return;
        scannedDirs++;
        if (onProgress) {
            onProgress(dir);
        }
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            return; // Skip directories we can't read
        }
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            const fullPath = path.join(dir, entry.name);
            // Skip hidden directories except the ones we're looking for
            if (entry.name.startsWith('.') && !CRUFT_PATTERNS.includes(entry.name)) {
                continue;
            }
            if (isCruftDirectory(entry.name)) {
                // Found cruft! Calculate its size
                const size = getDirectorySize(fullPath);
                items.push({
                    path: fullPath,
                    size,
                    type: entry.name,
                });
                // Don't recurse into cruft directories
            }
            else {
                // Recurse into this directory
                scan(fullPath, depth + 1);
            }
        }
    }
    // Validate root directory exists
    if (!fs.existsSync(rootDir)) {
        throw new Error(`Directory does not exist: ${rootDir}`);
    }
    const stats = fs.statSync(rootDir);
    if (!stats.isDirectory()) {
        throw new Error(`Not a directory: ${rootDir}`);
    }
    scan(rootDir);
    const totalSize = items.reduce((sum, item) => sum + item.size, 0);
    return {
        items,
        totalSize,
        scannedDirs,
    };
}
export function getCruftTypes() {
    return [...CRUFT_PATTERNS];
}
