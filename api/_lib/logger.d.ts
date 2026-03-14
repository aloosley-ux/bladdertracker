// Type definitions for logger.js
// This file provides type safety for the logger import in TypeScript files.

declare interface Logger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

declare const logger: Logger;
export { logger };
