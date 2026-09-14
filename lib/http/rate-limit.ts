import { createHash } from "node:crypto";

export interface RateLimitPolicy {
  maxRequests: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_BUCKETS = 10_000;
const buckets = new Map<string, Bucket>();

export function privacySafeClientKey(request: Request): string {
  const isVercel = process.env.VERCEL === "1";
  const source = isVercel
    ? request.headers.get("x-vercel-forwarded-for")?.split(",", 1)[0]?.trim()
      ?? request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim()
      ?? "anonymous"
    : "anonymous";
  return createHash("sha256").update(source).digest("hex");
}

function pruneExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function consumeRequestRateLimit(
  scope: string,
  key: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  pruneExpired(now);
  const bucketKey = `${scope}:${key}`;
  const bucket = buckets.get(bucketKey);
  if (!bucket) {
    if (buckets.size >= MAX_BUCKETS) {
      const earliestReset = Math.min(...[...buckets.values()].map((value) => value.resetAt));
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((earliestReset - now) / 1_000)) };
    }
    buckets.set(bucketKey, { count: 1, resetAt: now + policy.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= policy.maxRequests) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRequestRateLimitsForTest(): void {
  buckets.clear();
}
