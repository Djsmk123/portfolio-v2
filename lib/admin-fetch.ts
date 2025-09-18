import { getAdminUser } from './localstorage'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number | undefined>
  body?: unknown
  signal?: AbortSignal
  retries?: number
}

const cache = new Map<string, any>()

function buildUrl (url: string, params?: FetchOptions['params']): string {
  if (!params) return url
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `${url}?${qs}` : url
}

export async function adminFetch<T> (url: string, opts: FetchOptions = {}): Promise<T> {
  const token = getAdminUser()?.access_token
  const method = opts.method || 'GET'
  const fullUrl = buildUrl(url, opts.params)
  const cacheKey = method === 'GET' ? fullUrl : ''
  if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey)

  const controller = new AbortController()
  const signal = opts.signal || controller.signal
  const retries = Math.max(opts.retries ?? 2, 0)

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'

  let attempt = 0
  let lastErr: any
  while (attempt <= retries) {
    try {
      const res = await fetch(fullUrl, {
        method,
        credentials: 'include',
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (cacheKey) cache.set(cacheKey, data)
      return data as T
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e
      lastErr = e
      // exponential backoff
      const wait = Math.min(500 * Math.pow(2, attempt), 3000)
      await new Promise(r => setTimeout(r, wait))
      attempt++
    }
  }
  throw lastErr
}

export function clearAdminFetchCache (prefix?: string) {
  if (!prefix) return cache.clear()
  for (const key of [...cache.keys()]) if (key.startsWith(prefix)) cache.delete(key)
}


