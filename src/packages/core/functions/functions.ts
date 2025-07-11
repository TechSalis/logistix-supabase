export function isRecord(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}