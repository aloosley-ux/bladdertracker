export const logger = {
  error: (...args) => {
    try {
      console.error(...args);
    } catch {}
  },
  warn: (...args) => {
    try { console.warn(...args); } catch {}
  },
  info: (...args) => {
    try { console.info(...args); } catch {}
  },
};
