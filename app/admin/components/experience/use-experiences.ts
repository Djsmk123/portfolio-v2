"use client"

import { useEffect, useRef, useState } from 'react'
import { getAdminUser } from '@/lib/localstorage'
import type { experienceType } from '@/app/data/type'
import { fromDb, toDb } from './utils'

export function useExperiences () {
  const [items, setItems] = useState<experienceType[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [type, setType] = useState<string>('all')
  const [activeType, setActiveType] = useState<number>(0) // 0=all,1=active,2=inactive
  const savingRef = useRef(false)
  const didRunRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    async function load () {
      setIsFetching(true)
      setError(null)
      try {
        const token = getAdminUser()?.access_token
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (query.trim()) params.set('search', query.trim())
        if (type && type !== 'all') params.set('type', type)
        if (activeType) params.set('activeType', String(activeType))

        const res = await fetch(`/api/admin/experiences?${params.toString()}`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal
        })
        if (!res.ok) throw new Error(`Failed to load experiences (${res.status})`)
        const data = await res.json()
        const list = Array.isArray(data.experiences) ? data.experiences.map(fromDb) : []
        if (!cancelled) {
          setItems(list)
          setTotal(typeof data.total === 'number' ? data.total : 0)
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load experiences')
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    }
    // Prevent double fetch in React Strict Mode (dev) while still reacting to deps changes
    if (didRunRef.current) return () => { controller.abort() }
    didRunRef.current = true
    load()
    return () => { cancelled = true; controller.abort(); didRunRef.current = false }
  }, [page, limit, query, type, activeType])

  async function createExperience (draft: experienceType) {
    if (savingRef.current) return
    savingRef.current = true
    try {
      const token = getAdminUser()?.access_token
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(toDb(draft))
      })
      if (!res.ok) throw new Error('Failed to create experience')
      const { experience } = await res.json()
      const created = fromDb(experience)
      setItems(prev => [created, ...prev])
      return created
    } finally {
      savingRef.current = false
    }
  }

  async function updateExperience (exp: experienceType) {
    const token = getAdminUser()?.access_token
    const res = await fetch('/api/admin/experiences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
      body: JSON.stringify({ id: exp.id, ...toDb(exp) })
    })
    if (!res.ok) throw new Error('Failed to update experience')
    const { experience } = await res.json()
    const updated = fromDb(experience)
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)))
  }

  async function removeExperience (id: string) {
    const token = getAdminUser()?.access_token
    const res = await fetch(`/api/admin/experiences?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: 'include'
    })
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete experience')
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, type, setType, activeType, setActiveType, createExperience, updateExperience, removeExperience }
}


