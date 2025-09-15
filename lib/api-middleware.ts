import { NextResponse } from 'next/server'

export type ApiHandler<TReq = unknown> = (ctx: {
  req: Request
  json: <T = any>() => Promise<T>
  headers: Headers
  ip: string | null
  userId: string | null
}) => Promise<NextResponse>

export function withApiMiddleware (handler: ApiHandler) {
  return async function wrapped (req: Request) {
    try {
      const headers = new Headers(req.headers)
      const ip = headers.get('x-forwarded-for') || null
      // In a real app, verify JWT from Supabase to extract user id
      const userId = headers.get('x-user-id') || null
      const json = async () => await req.json().catch(() => ({}))

      return await handler({ req, json, headers, ip, userId })
    } catch (err: any) {
      const message = err?.message || 'Internal Server Error'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}


