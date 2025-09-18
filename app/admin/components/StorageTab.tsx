"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { getAdminUser } from '@/lib/localstorage'
import { LimitSelect } from '../components/projects-management'

type FileItem = { id: string, name: string, url: string, size: number }

export default function StorageTab () {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [path, setPath] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(30)
  const [folders, setFolders] = useState<{ id: string, name: string }[]>([])
  const didRunRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load () {
    setIsFetching(true)
    setError(null)
    try {
      const token = getAdminUser()?.access_token
      const params = new URLSearchParams({ prefix: path || '', page: String(page), limit: String(limit) })
      const res = await fetch(`/api/admin/storage?${params.toString()}`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (!res.ok) throw new Error('Failed to list files')
      const data = await res.json()
      setFiles(Array.isArray(data.files) ? data.files : [])
      setFolders(Array.isArray(data.folders) ? data.folders : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to list files')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (didRunRef.current) return
    didRunRef.current = true
    load()
    return () => { didRunRef.current = false }
  }, [])

  useEffect(() => { load() }, [path, page, limit])

  function goUp () {
    if (!path) return
    const segs = path.split('/').filter(Boolean)
    segs.pop()
    setPath(segs.join('/'))
    setPage(1)
  }

  async function onUpload () {
    const file = inputRef.current?.files?.[0]
    if (!file) return
    const token = getAdminUser()?.access_token
    const form = new FormData()
    form.append('file', file)
    form.append('path', path)
    const res = await fetch('/api/admin/storage', {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form
    })
    if (res.ok) load()
  }

  async function onDelete (id: string) {
    if (!confirm('Delete file?')) return
    const token = getAdminUser()?.access_token
    const res = await fetch(`/api/admin/storage?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
    if (res.ok || res.status === 204) setFiles(prev => prev.filter(f => f.id !== id))
  }

  function renderPreview (item: FileItem) {
    const lower = item.name.toLowerCase()
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.gif')) {
      return <img src={item.url} alt={item.name} className="w-full h-40 object-cover rounded" />
    }
    if (lower.endsWith('.pdf')) {
      return <iframe src={item.url} className="w-full h-40 rounded" />
    }
    return <div className="text-sm text-muted-foreground">No preview</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Input placeholder="folder/optional" value={path} onChange={e => { setPath(e.target.value); setPage(1) }} className="w-full sm:w-64" />
        <Input type="file" ref={inputRef} className="w-full sm:w-64" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={onUpload} className="w-full sm:w-auto">Upload</Button>
          <Button variant="outline" onClick={load} disabled={isFetching} className="w-full sm:w-auto">Refresh</Button>
          <Button variant="outline" onClick={goUp} disabled={!path} className="w-full sm:w-auto">Up</Button>
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {!!folders.length && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {folders.map(f => (
            <Button key={f.id} variant="outline" onClick={() => { setPath(f.id); setPage(1) }} className="justify-start">📁 {f.name}</Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => (
          <Card key={f.id}>
            <CardContent className="p-3 space-y-2">
              {renderPreview(f)}
              <div className="text-sm font-medium truncate" title={f.name}>{f.name}</div>
              <div className="flex items-center justify-between">
                <a href={f.url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Open</a>
                <Button variant="ghost" size="sm" onClick={() => onDelete(f.id)} className="text-red-500">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="text-sm text-muted-foreground w-full sm:w-auto">Path: /{path}</div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1 || isFetching} className="w-full sm:w-auto">Prev</Button>
          <Button variant="outline" onClick={() => setPage(page + 1)} disabled={isFetching} className="w-full sm:w-auto">Next</Button>
          <div className="w-full sm:w-auto">
            <LimitSelect limit={limit} setLimit={setLimit} name="storage" />
          </div>
        </div>
      </div>
    </div>
  )
}


