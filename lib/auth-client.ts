import { AuthUser, AuthSession, AuthResponse } from './auth-server'

export type { AuthUser, AuthSession, AuthResponse }

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
}

export interface AuthError {
  message: string
  code?: string
}

export class AuthService {
  private static instance: AuthService
  private listeners: Set<(state: AuthState) => void> = new Set()
  private state: AuthState = {
    user: null,
    session: null,
    loading: true
  }

  private constructor() {
    this.initializeAuth()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async initializeAuth() {
    try {
      // First, try to get session from localStorage as fallback
      const existingSession = this.getStoredSession()
      if (existingSession) {
        this.updateState({
          user: existingSession.user,
          session: existingSession.session,
          loading: false
        })
      }

      // Then try to validate with server
      const response = await this.makeRequest('/api/auth/me', {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        this.updateState({
          user: data.user,
          session: data.session,
          loading: false
        })
        // Store the validated session
        this.storeSession(data.user, data.session)
      } else {
        // Server validation failed, clear stored session
        this.clearStoredSession()
        this.updateState({
          user: null,
          session: null,
          loading: false
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // On error, try to use stored session if available
      const existingSession = this.getStoredSession()
      if (existingSession) {
        this.updateState({
          user: existingSession.user,
          session: existingSession.session,
          loading: false
        })
      } else {
        this.updateState({
          user: null,
          session: null,
          loading: false
        })
      }
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach(listener => listener(this.state))
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const baseUrl = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || ''
    
    return fetch(`${baseUrl}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }

  async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    try {
      this.updateState({ loading: true })

      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        this.updateState({ loading: false })
        return { error: { message: data.error || 'Login failed' } }
      }

      this.updateState({
        user: data.user,
        session: data.session,
        loading: false
      })

      // Store session for persistence
      this.storeSession(data.user, data.session)

      return { error: null }
    } catch (error) {
      this.updateState({ loading: false })
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Network error' 
        } 
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.makeRequest('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.updateState({
        user: null,
        session: null,
        loading: false
      })
      // Clear stored session
      this.clearStoredSession()
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'x-refresh-token': this.state.session?.refresh_token || ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        this.updateState({
          user: data.user,
          session: data.session
        })
        // Store the refreshed session
        this.storeSession(data.user, data.session)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  getState(): AuthState {
    return { ...this.state }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getAccessToken(): string | null {
    return this.state.session?.access_token || null
  }

  isAuthenticated(): boolean {
    return !!this.state.user && !!this.state.session
  }

  // localStorage persistence methods
  private getStoredSession(): { user: AuthUser; session: AuthSession } | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem('auth-session')
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      if (!parsed.user || !parsed.session) return null
      
      // Check if session is expired
      const now = Math.floor(Date.now() / 1000)
      if (parsed.session.expires_at && now >= parsed.session.expires_at) {
        this.clearStoredSession()
        return null
      }
      
      return parsed
    } catch (error) {
      console.error('Error reading stored session:', error)
      this.clearStoredSession()
      return null
    }
  }

  private storeSession(user: AuthUser, session: AuthSession): void {
    if (typeof window === 'undefined') return
    
    try {
      const sessionData = { user, session }
      localStorage.setItem('auth-session', JSON.stringify(sessionData))
    } catch (error) {
      console.error('Error storing session:', error)
    }
  }

  private clearStoredSession(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem('auth-session')
    } catch (error) {
      console.error('Error clearing stored session:', error)
    }
  }
}
