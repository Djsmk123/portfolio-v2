import { RateLimitOptions, withRateLimit } from 'next-limitr'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, AuthResponse } from './auth-server'

export type ApiHandler<TJson = unknown> = (ctx: {
  req: Request
  json: <T = TJson>() => Promise<T>
  headers: Headers
  ip: string
  session?: AuthResponse | null
}) => Promise<NextResponse>

function getClientIp (req: NextRequest | Request): string {
  const headers = new Headers((req as NextRequest).headers ?? req.headers)
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    ((req as unknown as { ip?: string }).ip ?? 'unknown')
  )
}

export function withApiMiddleware<TJson = unknown> (
  handler: ApiHandler<TJson>,
  options?: RateLimitOptions
) {
  return async function wrapped (req: NextRequest) {
    try {
      const session = await getServerSession(req)
      
      const inner = async (incomingReq: Request) => {
        return handler({
          req: incomingReq,
          json: async () => await incomingReq.json().catch(() => ({} as TJson)),
          headers: new Headers(incomingReq.headers),
          ip: getClientIp(incomingReq),
          session
        })
      }

      const execute = options ? withRateLimit(options)(inner) : inner
      return await execute(req)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal Server Error'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}

export function withApiMiddlewareWithoutAuth<TJson = unknown> (
  handler: ApiHandler<TJson>,
  options?: RateLimitOptions
) {
  return async function wrapped (req: NextRequest) {
    try {
      const headers = new Headers(req.headers)
      const ip = getClientIp(req)
      const json = async () => await req.json().catch(() => ({} as TJson))

      const inner = async (incomingReq: Request) => {
        return handler({
          req: incomingReq,
          json: async () => await incomingReq.json().catch(() => ({} as TJson)),
          headers: new Headers(incomingReq.headers),
          ip: getClientIp(incomingReq)
        })
      }

      if (options) {
        const execute = withRateLimit(options)(inner)
        return await execute(req)
      }
      return await handler({ req, json, headers, ip })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal Server Error'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}
