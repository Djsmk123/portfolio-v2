import { adminUserType } from '@/app/data/type'
import type { Session } from '@supabase/supabase-js'
import { AuthSession, AuthUser } from './auth-client'

export function setAdminUser (user: adminUserType) {
  if (typeof window === 'undefined') return
  localStorage.setItem('adminUser', JSON.stringify(user))
}

export function getAdminUser (): adminUserType | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('adminUser')
  return user ? JSON.parse(user) : null
}

export function updateAdminUserRefreshToken (refreshToken: string) {
  if (typeof window === 'undefined') return
  const user = getAdminUser()
  if (!user) return
  const updatedUser = { ...user, refresh_token: refreshToken }
  setAdminUser(updatedUser)
}

export function removeAdminUser () {
  if (typeof window === 'undefined') return
  localStorage.setItem('adminUser', '')
}

export function clearAdminUser () {
  if (typeof window === 'undefined') return
  localStorage.removeItem('adminUser')
}

export function setAdminUserFromSession (session: Session) {
  if (!session || !session.access_token || !session.refresh_token) return
  const expiresIn = session.expires_in || 0
  const expiresAt = session.expires_at || Math.floor(Date.now() / 1000) + expiresIn
  const payload: adminUserType = {
    access_token: session.access_token,
    token_type: session.token_type || 'bearer',
    expires_in: expiresIn,
    expires_at: expiresAt,
    refresh_token: session.refresh_token,
    user: {
      id: session.user.id,
      email: session.user.email || ''
    }
  }
  setAdminUser(payload)
}

export function getAccessToken (): string | null {
  const u = getAdminUser()
  return u?.access_token || null
}

// Token refresh utilities
export function isTokenExpired (): boolean {
  const user = getAdminUser()
  if (!user?.expires_at) return true
  
  const now = Math.floor(Date.now() / 1000)
  const buffer = 5 * 60 // 5 minutes buffer
  return now >= (user.expires_at - buffer)
}

export function getRefreshToken (): string | null {
  const user = getAdminUser()
  return user?.refresh_token || null
}

export async function refreshTokenFromAPI (): Promise<{ success: boolean; session?: AuthSession; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // This will send the refresh token cookie
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Token refresh failed' }
    }

    const data = await response.json()
    return { 
      success: true, 
      session: data.session, 
      user: data.user 
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

export function updateAdminUserFromAuthData (session: AuthSession, user: AuthUser): void {
  if (typeof window === 'undefined') return
  
  const payload: adminUserType = {
    access_token: session.access_token,
    token_type: session.token_type || 'bearer',
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: {
      id: user.id,
      email: user.email
    }
  }
  setAdminUser(payload)
}

// Auto-refresh token if needed
export async function ensureValidToken (): Promise<string | null> {
  if (typeof window === 'undefined') return null
  
  const currentToken = getAccessToken()
  
  if (!currentToken || isTokenExpired()) {
    const refreshResult = await refreshTokenFromAPI()
    
    if (refreshResult.success && refreshResult.session && refreshResult.user) {
      updateAdminUserFromAuthData(refreshResult.session, refreshResult.user)
      return refreshResult.session.access_token
    } else {
      // Refresh failed, clear user data
      clearAdminUser()
      return null
    }
  }
  
  return currentToken
}
