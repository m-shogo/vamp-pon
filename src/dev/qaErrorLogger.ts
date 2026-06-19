function formatUnknownError(reason: unknown): string {
  if (reason instanceof Error) return `${reason.name}: ${reason.message}\n${reason.stack ?? '(no stack)'}`;
  if (reason && typeof reason === 'object') {
    try {
      return JSON.stringify(reason, Object.getOwnPropertyNames(reason), 2);
    } catch {
      return Object.prototype.toString.call(reason);
    }
  }
  return String(reason);
}

export function installQaErrorLogger(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    console.error('[VampPon QA error]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: formatUnknownError(event.error),
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[VampPon QA unhandledrejection]', formatUnknownError(event.reason));
  });
}
