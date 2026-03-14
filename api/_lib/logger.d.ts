// Type definitions for logger.js
// This file provides type safety for the logger import in TypeScript files.

declare interface Logger {
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
}

declare const logger: Logger;
export { logger };
