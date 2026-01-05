import { headers } from 'next/headers'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  blockDurationMs: number
}

const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number; blockedUntil?: number }
>()

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    blockDurationMs: 3600000, // 1 hour
  }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // Check if blocked
  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.blockedUntil,
    }
  }

  // Reset if window expired
  if (!record || record.resetAt < now) {
    const resetAt = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    }
  }

  // Increment count
  record.count++

  // Block if exceeded
  if (record.count > config.maxRequests) {
    record.blockedUntil = now + config.blockDurationMs
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.blockedUntil,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown'
  return ip
}
