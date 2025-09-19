import { useCallback } from 'react'
import { useAuth } from '../auth-context'
import { ensureValidToken, getAdminUser } from '../localstorage'

export function useAdminAuth() {
  const { user, session, loading, signIn, signOut, refreshToken, isTokenValid } = useAuth()

  // Get a valid token for admin operations
  const getValidAdminToken = useCallback(async (): Promise<string | null> => {
    if (!user || !session) return null

    // First try to get from AuthService
    if (isTokenValid()) {
      return session.access_token
    }

    // If token is invalid, try to refresh
    const refreshed = await refreshToken()
    if (refreshed) {
      return session.access_token
    }

    // Fallback to localStorage
    return await ensureValidToken()
  }, [user, session, isTokenValid, refreshToken])

  // Check if user has admin access
  const isAdmin = useCallback((): boolean => {
    return !!(user && session && isTokenValid())
  }, [user, session, isTokenValid])

  // Get admin user data from localStorage
  const getAdminUserData = useCallback(() => {
    return getAdminUser()
  }, [])

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    refreshToken,
    isTokenValid,
    getValidAdminToken,
    isAdmin,
    getAdminUserData
  }
}
