const WINDOW_MS = 15 * 60 * 1000;
const MAX_REPORTS_PER_WINDOW = 5;
import {
  consumeRequestRateLimit,
  privacySafeClientKey,
  resetRequestRateLimitsForTest,
} from "../http/rate-limit";

export function reportRateLimitKey(request: Request): string {
  return privacySafeClientKey(request);
}

export function consumeReportRateLimit(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  return consumeRequestRateLimit("report", key, {
    maxRequests: MAX_REPORTS_PER_WINDOW,
    windowMs: WINDOW_MS,
  }, now);
}

export function resetReportRateLimitsForTest(): void { resetRequestRateLimitsForTest(); }
