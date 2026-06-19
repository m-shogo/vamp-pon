let installed = false;

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

function looksLikeOpaqueObject(args: unknown[]): boolean {
  return args.length === 1 && !!args[0] && typeof args[0] === 'object' && !(args[0] instanceof Error);
}

export function installQaErrorLogger(): void {
  if (typeof window === 'undefined' || installed) return;
  installed = true;

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (looksLikeOpaqueObject(args)) {
      originalError('[VampPon QA console.error object]', formatUnknownError(args[0]), args[0]);
      return;
    }
    originalError(...args);
  };

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
