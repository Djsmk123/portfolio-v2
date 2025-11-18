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

function addCorsHeaders (response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export function withApiMiddlewareWithoutAuth<TJson = unknown> (
  handler: ApiHandler<TJson>,
  options?: RateLimitOptions
) {
  return async function wrapped (req: NextRequest) {
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      return addCorsHeaders(response)
    }

    try {
      const headers = new Headers(req.headers)
      const ip = getClientIp(req)
      const json = async () => await req.json().catch(() => ({} as TJson))

      const inner = async (incomingReq: Request) => {
        const response = await handler({
          req: incomingReq,
          json: async () => await incomingReq.json().catch(() => ({} as TJson)),
          headers: new Headers(incomingReq.headers),
          ip: getClientIp(incomingReq)
        })
        return addCorsHeaders(response)
      }

      if (options) {
        const execute = withRateLimit(options)(inner)
        const response = await execute(req)
        return addCorsHeaders(response)
      }
      const response = await handler({ req, json, headers, ip })
      return addCorsHeaders(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal Server Error'
      const response = NextResponse.json({ error: message }, { status: 500 })
      return addCorsHeaders(response)
    }
  }
}
