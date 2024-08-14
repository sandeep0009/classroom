import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "./redisClient";
export async function rateLimiter(req: NextRequest): Promise<NextResponse | null> {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'localhost';
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return  NextResponse.json(
        { message: 'Rate limit exceeded' },
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      );
    }

    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return NextResponse.json(
        {message:'error'},
      
      { 
        status: 500, 
        
      }
    );
  }
}