import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

const SENTRY_DSN = process.env.SENTRY_DSN || '';

if (SENTRY_DSN && !SENTRY_DSN.includes('your_sentry')) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development'
  });
  console.log('[Sentry] Initialized Sentry error monitoring.');
} else {
  console.log('[Sentry] SENTRY_DSN not configured. Local error tracking active.');
}

export function captureAgentError(agentName: string, error: Error | any, context?: Record<string, any>) {
  console.error(`[Error Tracking - ${agentName}]`, error?.message || error);
  if (SENTRY_DSN && Sentry.captureException) {
    Sentry.withScope((scope) => {
      scope.setTag('agent', agentName);
      if (context) scope.setContext('agent_context', context);
      Sentry.captureException(error);
    });
  }
}
