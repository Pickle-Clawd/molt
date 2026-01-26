import { type ScanResult } from './utils.js';
export declare function scanDirectory(rootDir: string, onProgress?: (dir: string) => void): Promise<ScanResult>;
export declare function getCruftTypes(): string[];
