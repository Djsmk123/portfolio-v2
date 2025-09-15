"use client"

import { useEffect, useRef, useState } from 'react'
import { getAdminUser } from '@/lib/localstorage'
import type { projectType } from '@/app/data/mock'
import { fromDb, toDb } from '@/app/admin/components/projects/utils'

export function useProjects () {
  const [projects, setProjects] = useState<projectType[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const isSavingRef = useRef(false)

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
        const res = await fetch(`/api/admin/projects?${params.toString()}`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal
        })
        if (!res.ok) throw new Error(`Failed to load projects (${res.status})`)
        const data = await res.json()
       
        const list = Array.isArray(data.projects)
          ? data.projects.map(fromDb)
          : []
        if (!cancelled) {
          setProjects(list)
          setTotal(typeof data.total === 'number' ? data.total : 0)
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        if (!cancelled) setError(e?.message || 'Failed to load projects')
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    }
    load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [page, limit, query])

  async function createProject (draft: projectType) {
    if (isSavingRef.current) return
    isSavingRef.current = true
    try {
      const token = getAdminUser()?.access_token
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(toDb(draft))
      })
      if (!res.ok) throw new Error('Failed to create project')
      const { project } = await res.json()
      const created = fromDb(project)
      setProjects(prev => [...prev, created])
      return created
    } finally {
      isSavingRef.current = false
    }
  }

  async function updateProject (editing: projectType) {
    const token = getAdminUser()?.access_token
    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify({ id: editing.id, ...toDb(editing) })
    })
    if (!res.ok) throw new Error('Failed to update project')
    const { project } = await res.json()
    const updated = fromDb(project)
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))
  }

  async function deleteProject (id: string) {
    const token = getAdminUser()?.access_token
    const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: 'include'
    })
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete project')
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return { projects, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, createProject, updateProject, removeProject: deleteProject }
}


