// lib/rateLimit.ts
// Simple in-memory rate limiter (resets on serverless cold starts — fine for Vercel)

const requestCounts = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip)!;
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil(
      (recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1000
    );
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  requestCounts.set(ip, recent);
  return { allowed: true };
}
