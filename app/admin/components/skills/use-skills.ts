"use client"

import { useEffect, useRef, useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

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
        const data = await adminFetch<any>('/api/admin/skills', { params: { page, limit, search: query.trim() || undefined, category: category !== 'all' ? category : undefined }, signal: controller.signal })
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
      const res = await adminFetch<any>('/api/admin/skills', {
        method: 'POST',
        body: {
          name: draft.name,
          category: draft.category,
          level: draft.level,
          yearsOfExperience: draft.yearsOfExperience,
          icon: draft.icon ?? null,
          color: draft.color ?? null,
          is_active: draft.is_active ?? true
        }
      })
      const { skill } = res
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
    const res = await adminFetch<any>('/api/admin/skills', {
      method: 'PATCH',
      body: {
        id: editing.id,
        name: editing.name,
        category: editing.category,
        level: editing.level,
        yearsOfExperience: editing.yearsOfExperience,
        icon: editing.icon ?? null,
        color: editing.color ?? null,
        is_active: editing.is_active ?? true
      }
    })
    const { skill } = res
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
    await adminFetch('/api/admin/skills', { method: 'DELETE', params: { id } })
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return { skills, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, category, setCategory, createSkill, updateSkill, removeSkill }
}


