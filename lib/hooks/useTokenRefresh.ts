import { useEffect, useCallback } from 'react'
import { useAuth } from '../auth-context'
import { isTokenExpired } from '../localstorage'

export function useTokenRefresh() {
  const { refreshToken, isTokenValid, user, session } = useAuth()

  // Auto-refresh token when it's about to expire
  const checkAndRefreshToken = useCallback(async () => {
    if (!user || !session) return

    if (isTokenExpired()) {
      const refreshed = await refreshToken()
      if (!refreshed) {
        console.warn('Token refresh failed')
      }
    }
  }, [user, session, refreshToken])

  useEffect(() => {
    if (!user || !session) return

    // Check token validity every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000)

    // Also check immediately
    checkAndRefreshToken()

    return () => clearInterval(interval)
  }, [user, session, checkAndRefreshToken])

  return {
    refreshToken,
    isTokenValid,
    checkAndRefreshToken
  }
}
