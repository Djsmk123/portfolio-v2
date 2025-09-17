"use client"

import { useEffect, useRef, useState } from 'react'
import { getAdminUser } from '@/lib/localstorage'

export type Skill = {
  id: string
  name: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsOfExperience: number
  icon?: string
  color?: string
  is_active?: boolean
}

export function useSkills () {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
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
        if (category !== 'all') params.set('category', category)
        const res = await fetch(`/api/admin/skills?${params.toString()}`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal
        })
        if (!res.ok) throw new Error(`Failed to load skills (${res.status})`)
        const data = await res.json()
        const list: Skill[] = Array.isArray(data.skills)
          ? data.skills.map((s: any) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              level: s.level,
              yearsOfExperience: s.years_of_experience ?? s.yearsOfExperience ?? 0,
              icon: s.icon || undefined,
              color: s.color || undefined,
              is_active: s.is_active !== false
            }))
          : []
        if (!cancelled) {
          setSkills(list)
          setTotal(typeof data.total === 'number' ? data.total : 0)
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load skills')
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    }
    if (didRunRef.current) return () => { controller.abort() }
    didRunRef.current = true
    load()
    return () => { cancelled = true; controller.abort(); didRunRef.current = false }
  }, [page, limit, query, category])

  async function createSkill (draft: Skill) {
    if (savingRef.current) return
    savingRef.current = true
    try {
      const token = getAdminUser()?.access_token
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          name: draft.name,
          category: draft.category,
          level: draft.level,
          yearsOfExperience: draft.yearsOfExperience,
          icon: draft.icon ?? null,
          color: draft.color ?? null,
          is_active: draft.is_active ?? true
        })
      })
      if (!res.ok) throw new Error('Failed to create skill')
      const { skill } = await res.json()
      const created: Skill = {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        yearsOfExperience: skill.years_of_experience ?? 0,
        icon: skill.icon || undefined,
        color: skill.color || undefined,
        is_active: skill.is_active !== false
      }
      setSkills(prev => [created, ...prev])
      return created
    } finally {
      savingRef.current = false
    }
  }

  async function updateSkill (editing: Skill) {
    const token = getAdminUser()?.access_token
    const res = await fetch('/api/admin/skills', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        id: editing.id,
        name: editing.name,
        category: editing.category,
        level: editing.level,
        yearsOfExperience: editing.yearsOfExperience,
        icon: editing.icon ?? null,
        color: editing.color ?? null,
        is_active: editing.is_active ?? true
      })
    })
    if (!res.ok) throw new Error('Failed to update skill')
    const { skill } = await res.json()
    const updated: Skill = {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      yearsOfExperience: skill.years_of_experience ?? 0,
      icon: skill.icon || undefined,
      color: skill.color || undefined,
      is_active: skill.is_active !== false
    }
    setSkills(prev => prev.map(s => (s.id === updated.id ? updated : s)))
  }

  async function removeSkill (id: string) {
    const token = getAdminUser()?.access_token
    const res = await fetch(`/api/admin/skills?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete skill')
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return { skills, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, category, setCategory, createSkill, updateSkill, removeSkill }
}


