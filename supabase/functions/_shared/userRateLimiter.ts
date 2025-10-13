/**
 * Enhanced rate limiter with user-based tracking
 * 
 * This provides more secure rate limiting by tracking requests per authenticated user,
 * preventing attackers from bypassing IP-based limits with proxies/VPNs.
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
 * Check if a request should be rate limited (user-based)
 * @param userId - Authenticated user ID
 * @param config - Rate limit configuration
 * @returns Object with isLimited boolean and remaining requests count
 */
export function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig
): { isLimited: boolean; remaining: number; resetTime: number } {
  const key = config.keyPrefix ? `${config.keyPrefix}:user:${userId}` : `user:${userId}`;
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
 * Middleware to apply user-based rate limiting to edge functions
 * @param userId - Authenticated user ID
 * @param config - Rate limit configuration
 * @param corsHeaders - CORS headers to include in response
 * @returns Response object if rate limited, null otherwise
 */
export function userRateLimitMiddleware(
  userId: string,
  config: RateLimitConfig,
  corsHeaders: Record<string, string>
): Response | null {
  const { isLimited, remaining, resetTime } = checkUserRateLimit(userId, config);
  
  if (isLimited) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    
    console.warn(`[RATE-LIMIT] User ${userId} exceeded rate limit for ${config.keyPrefix || 'default'}`);
    
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
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
