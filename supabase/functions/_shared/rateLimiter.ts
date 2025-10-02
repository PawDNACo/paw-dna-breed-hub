/**
 * Simple in-memory rate limiter for edge functions
 * 
 * Note: This is per-instance rate limiting. For distributed rate limiting,
 * consider using a Redis-based solution or Supabase's rate limiting features.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
  keyPrefix?: string; // Optional prefix for the rate limit key
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the requester (e.g., user ID, IP address)
 * @param config - Rate limit configuration
 * @returns Object with isLimited boolean and remaining requests count
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { isLimited: boolean; remaining: number; resetTime: number } {
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // Initialize or reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      isLimited: false,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment counter
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      isLimited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  return {
    isLimited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Middleware to apply rate limiting to edge functions
 * @param identifier - Unique identifier for the requester
 * @param config - Rate limit configuration
 * @returns Response object if rate limited, null otherwise
 */
export function rateLimitMiddleware(
  identifier: string,
  config: RateLimitConfig,
  corsHeaders: Record<string, string>
): Response | null {
  const { isLimited, remaining, resetTime } = checkRateLimit(identifier, config);
  
  if (isLimited) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(resetTime / 1000)),
          "Retry-After": String(retryAfter),
        },
      }
    );
  }
  
  return null;
}
