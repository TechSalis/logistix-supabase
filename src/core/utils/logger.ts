// utils/logger.ts
// type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// export function log(message: string, meta: Record<string, unknown> = {}) {
//     console.log(JSON.stringify({
//         message,
//         ...meta,
//         timestamp: new Date().toISOString(),
//     }));
// }

// export function debug(message: string, meta: Record<string, unknown> = {}) {
//     console.debug(JSON.stringify({
//         message,
//         ...meta,
//         timestamp: new Date().toISOString(),
//     }));
// }

export function error(message: string, meta: Record<string, unknown> = {}) {
    console.error(JSON.stringify({
        message,
        ...meta,
        timestamp: new Date().toISOString(),
    }));
}
