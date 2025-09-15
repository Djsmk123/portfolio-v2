import { adminUserType } from '@/app/data/type'
import type { Session } from '@supabase/supabase-js'

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
