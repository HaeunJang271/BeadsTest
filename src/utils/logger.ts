type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * 앱 공통 로거. 콘솔에 접두사와 함께 출력한다.
 */
export function log(level: LogLevel, message: string, detail?: unknown): void {
  const prefix = `[시아상점:${level}]`;
  if (detail !== undefined) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](prefix, message, detail);
    return;
  }
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](prefix, message);
}
