import { NextResponse } from 'next/server'
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { serverConfig } from '@/lib/config'

export const runtime = 'nodejs'

export const POST = withApiMiddlewareWithoutAuth(async ({ headers, req }) => {
  // Try to get refresh token from cookies first (more secure)
  const refreshTokenFromCookie = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('sb-refresh-token='))
    ?.split('=')[1]

  // Fallback to header for backward compatibility
  const refreshTokenFromHeader = headers.get('x-refresh-token')
  
  const refreshToken = refreshTokenFromCookie || refreshTokenFromHeader

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token is required' },
      { status: 400 }
    )
  }

  try {
    const supabase = createClient(
      serverConfig.supabaseUrl,
      serverConfig.supabaseAnonKey
    )

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session refreshed' },
        { status: 401 }
      )
    }

    const { session, user } = data

    // Create a secure HTTP-only cookie for the new session
    const response = NextResponse.json({
      user: {
        id: user?.id,
        email: user?.email,
        created_at: user?.created_at,
        updated_at: user?.updated_at
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type
      }
    })

    // Set HTTP-only cookies for security
    response.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.expires_in || 3600,
      path: '/'
    })

    response.cookies.set('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
