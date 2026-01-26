import { type CruftItem } from './utils.js';
export declare function confirmClean(items: CruftItem[], totalSize: number): Promise<boolean>;
export interface CleanResult {
    deleted: number;
    failed: number;
    freedSpace: number;
    errors: Array<{
        path: string;
        error: string;
    }>;
}
export declare function cleanItems(items: CruftItem[], onProgress?: (item: CruftItem, index: number, total: number) => void): Promise<CleanResult>;
