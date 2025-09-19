import { NextResponse } from 'next/server'
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { serverConfig } from '@/lib/config'

export const runtime = 'nodejs'

export const GET = withApiMiddlewareWithoutAuth(async ({ headers, req }) => {
  // Try to get access token from cookies first
  const accessTokenFromCookie = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('sb-access-token='))
    ?.split('=')[1]

  // Fallback to header
  const accessTokenFromHeader = headers.get('authorization')?.replace('Bearer ', '')
  
  const accessToken = accessTokenFromCookie || accessTokenFromHeader

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token is required' },
      { status: 401 }
    )
  }

  try {
    const supabase = createClient(
      serverConfig.supabaseUrl,
      serverConfig.supabaseAnonKey
    )

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get refresh token from cookies
    const refreshToken = req.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('sb-refresh-token='))
      ?.split('=')[1]

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      session: {
        access_token: accessToken,
        refresh_token: refreshToken || '',
        expires_in: 3600, // Default 1 hour
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer'
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
