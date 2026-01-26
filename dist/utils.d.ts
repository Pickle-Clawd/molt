export declare const LOBSTER = "\uD83E\uDD9E";
export declare const CRUFT_PATTERNS: string[];
export interface CruftItem {
    path: string;
    size: number;
    type: string;
}
export interface ScanResult {
    items: CruftItem[];
    totalSize: number;
    scannedDirs: number;
}
export declare function formatBytes(bytes: number): string;
export declare function getTypeColor(type: string): string;
export declare function printBanner(): void;
export declare function printScanResult(result: ScanResult, verbose?: boolean): void;
export declare function printCleanResult(freedSpace: number, deletedCount: number): void;
export declare function printDryRunResult(result: ScanResult): void;
export declare function printError(message: string): void;
export declare function lobsterMessage(message: string): string;
