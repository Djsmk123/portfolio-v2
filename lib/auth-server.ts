import { createClient } from '@supabase/supabase-js'
import { serverConfig } from './config'
import { NextRequest, NextResponse } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  token_type: string
}

export interface AuthResponse {
  user: AuthUser
  session: AuthSession
}

export function getSupabaseClient() {
  return createClient(
    serverConfig.supabaseUrl,
    serverConfig.supabaseAnonKey
  )
}

export async function getServerSession(request: NextRequest): Promise<AuthResponse | null> {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value
    const refreshToken = request.cookies.get('sb-refresh-token')?.value

    if (!accessToken || !refreshToken) {
      return null
    }

    const supabase = getSupabaseClient()

    // First, try to get user with current access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)

    if (!userError && user) {
      // Access token is still valid
      return {
        user: {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 3600, // Default 1 hour
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer'
        }
      }
    }

    // Access token is invalid, try to refresh
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (refreshError || !refreshData.session) {
      return null
    }

    const { session, user: refreshedUser } = refreshData

    return {
      user: {
        id: refreshedUser.id,
        email: refreshedUser.email || '',
        created_at: refreshedUser.created_at,
        updated_at: refreshedUser.updated_at
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in || 3600,
        expires_at: session.expires_at || Math.floor(Date.now() / 1000) + 3600,
        token_type: session.token_type || 'bearer'
      }
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

export function createAuthResponse(data: AuthResponse): NextResponse {
  const response = NextResponse.json(data)

  // Set HTTP-only cookies for security
  response.cookies.set('sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.session.expires_in || 3600,
    path: '/'
  })

  response.cookies.set('sb-refresh-token', data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })

  return response
}

export function clearAuthCookies(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out successfully' })

  response.cookies.set('sb-access-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  response.cookies.set('sb-refresh-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return response
}
