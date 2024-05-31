export declare function debounce<T extends (...args: any[]) => any>(func: T, timeout?: number): (this: any, ...args: Parameters<T>) => void;
