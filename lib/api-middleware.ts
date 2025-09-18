import { RateLimitOptions, withRateLimit } from "next-limitr";
import { NextRequest, NextResponse } from "next/server";

export type ApiHandler<TJson = unknown> = (ctx: {
  req: Request
  json: <T = TJson>() => Promise<T>
  headers: Headers
  ip: string
}) => Promise<NextResponse>

function getClientIp(req: NextRequest | Request): string {
  const headers = new Headers((req as NextRequest).headers ?? req.headers)
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    // NextRequest on Vercel sometimes exposes req.ip
    ((req as any).ip as string | undefined) ||
    "unknown"
  )
}

export function withApiMiddleware<TJson = unknown>(
  handler: ApiHandler<TJson>,
  options?: RateLimitOptions
) {
  return async function wrapped(req: NextRequest) {
    try {
      const headers = new Headers(req.headers)
      const ip = getClientIp(req)
      const json = async () => await req.json().catch(() => ({} as TJson))

      const inner = async (incomingReq: Request) => {
        const incomingHeaders = new Headers(incomingReq.headers)
        const incomingIp = getClientIp(incomingReq)
        const safeJson = async () => await incomingReq.json().catch(() => ({} as TJson))
        return handler({
          req: incomingReq,
          json: safeJson,
          headers: incomingHeaders,
          ip: incomingIp,
        })
      }

      const execute = options ? withRateLimit(options)(inner) : inner
      return await execute(req)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error"
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}

// variant without auth but still with rate limit
export function withApiMiddlewareWithoutAuth<TJson = unknown>(
  handler: ApiHandler<TJson>,
  options?: RateLimitOptions
) {
  return async function wrapped(req: NextRequest) {
    try {
      const headers = new Headers(req.headers)
      const ip = getClientIp(req)
      const json = async () => await req.json().catch(() => ({} as TJson))

      const inner = async (incomingReq: Request) => {
        const incomingHeaders = new Headers(incomingReq.headers)
        const incomingIp = getClientIp(incomingReq)
        const safeJson = async () => await incomingReq.json().catch(() => ({} as TJson))
        return handler({
          req: incomingReq,
          json: safeJson,
          headers: incomingHeaders,
          ip: incomingIp,
        })
      }

      if (options) {
        const execute = withRateLimit(options)(inner)
        return await execute(req)
      }
      return await handler({ req, json, headers, ip })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error"
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}
