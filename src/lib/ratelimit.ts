/**
 * Simple in-memory rate limiter.
 * Works on Vercel Edge/Node serverless — resets per cold start.
 * For high-traffic production, replace with Upstash Redis.
 *
 * Usage:
 *   const result = rateLimit(ip, 'login', 5, 60)  // 5 attempts per 60 seconds
 *   if (!result.allowed) return 429
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store: key = `${action}:${identifier}`
const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes to prevent memory bloat
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

export function rateLimit(
  identifier: string,  // IP address or user ID
  action: string,      // e.g. 'login', 'signup', 'create-order'
  maxRequests: number, // max allowed in window
  windowSeconds: number // window size in seconds
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${action}:${identifier}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

// Extract real IP from Next.js request headers (Vercel sets x-forwarded-for)
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
