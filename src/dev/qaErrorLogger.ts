let installed = false;

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

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

function isSinglePlainObject(args: unknown[]): boolean {
  return args.length === 1 && !!args[0] && typeof args[0] === 'object' && !(args[0] instanceof Error);
}

function wrapConsoleMethod(method: ConsoleMethod): void {
  const original = console[method].bind(console);
  console[method] = (...args: unknown[]) => {
    if (isSinglePlainObject(args)) {
      const formatted = formatUnknownError(args[0]);
      original(`[VampPon QA console.${method} object]`, formatted, args[0]);
      (window as unknown as { __VAMP_PON_LAST_OPAQUE_LOG__?: string }).__VAMP_PON_LAST_OPAQUE_LOG__ = formatted;
      return;
    }
    original(...args);
  };
}

export function installQaErrorLogger(): void {
  if (typeof window === 'undefined' || installed) return;
  installed = true;

  for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
    wrapConsoleMethod(method);
  }

  window.addEventListener('error', (event) => {
    console.error('[VampPon QA error]', formatUnknownError({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: formatUnknownError(event.error),
    }));
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[VampPon QA unhandledrejection]', formatUnknownError(event.reason));
  });
}
