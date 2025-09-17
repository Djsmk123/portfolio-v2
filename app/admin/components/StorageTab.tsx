"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { getAdminUser } from '@/lib/localstorage'

type FileItem = { id: string, name: string, url: string, size: number }

export default function StorageTab () {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [path, setPath] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function load () {
    setIsFetching(true)
    setError(null)
    try {
      const token = getAdminUser()?.access_token
      const res = await fetch(`/api/admin/storage?prefix=${encodeURIComponent(path || '')}`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (!res.ok) throw new Error('Failed to list files')
      const data = await res.json()
      setFiles(Array.isArray(data.files) ? data.files : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to list files')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => { load() }, [path])

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
      <div className="flex items-center gap-2">
        <Input placeholder="folder/optional" value={path} onChange={e => setPath(e.target.value)} className="w-64" />
        <Input type="file" ref={inputRef} className="w-64" />
        <Button onClick={onUpload}>Upload</Button>
        <Button variant="outline" onClick={load} disabled={isFetching}>Refresh</Button>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}


