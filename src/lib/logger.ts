import * as Sentry from '@sentry/nextjs';

export const logger = {
  error: (error: Error, context?: Record<string, any>) => {
    console.error(error, context);
    Sentry.captureException(error, { extra: context });
  },
  
  info: (message: string, context?: Record<string, any>) => {
    console.info(message, context);
    Sentry.captureMessage(message, { level: 'info', extra: context });
  },
  
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(message, context);
    Sentry.captureMessage(message, { level: 'warning', extra: context });
  }
};
