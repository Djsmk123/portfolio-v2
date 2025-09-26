"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { projectType } from '@/app/data/type'
import { Plus, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type Props = {
  project: projectType
  isNew: boolean
  onChange: (p: projectType) => void
  onCancel: () => void
  onSave: () => void
  isSaving: boolean
}

export function EditProjectModal({ project, isNew, onChange, onCancel, onSave, isSaving }: Props) {
  const valid =
    typeof project.name === 'string' &&
    project.name.trim() &&
    typeof project.desc === 'string' &&
    project.desc.trim() &&
    Array.isArray(project.tags) &&
    project.tags.length > 0 &&
    Array.isArray(project.images) &&
    project.images.length > 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{isNew ? 'Add New Project' : 'Edit Project'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={project.name} onChange={e => onChange({ ...project, name: e.target.value })} />
            </div>
            <div className="flex items-end justify-end gap-2">
              <Label htmlFor="is-active" className="mr-2">Active</Label>
              <Switch
                id="is-active"
                checked={project.isActive !== false}
                onCheckedChange={(checked) => onChange({ ...project, isActive: Boolean(checked) } as projectType)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={project.desc} onChange={e => onChange({ ...project, desc: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="tags(Comma separated)" className='mb-2'>Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {project.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...project,
                        tags: project.tags.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                placeholder="Add tag"
                className="flex-1 border-none shadow-none focus-visible:ring-0 pl-2 m-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault()
                    const input = e.currentTarget
                    if (input.value.trim()) {
                      onChange({
                        ...project,
                        tags: [...project.tags, input.value.trim()],
                      })
                      input.value = ""
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <Label>Project Images</Label>
            <div className="space-y-2">
              {project.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image

                      src={image}
                      alt={`Project image ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover rounded"
                      style={{ objectFit: 'cover', borderRadius: '0.375rem' }}
                      unoptimized={false}
                      priority={index === 0}
                    />
                  </div>
                  <Input
                    value={image}
                    onChange={e => {
                      const images = [...project.images]
                      images[index] = e.target.value
                      onChange({ ...project, images })
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange({ ...project, images: project.images.filter((_, i) => i !== index) })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input placeholder="Add image URL" onKeyPress={e => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement
                    if (input.value.trim()) {
                      onChange({ ...project, images: [...project.images, input.value.trim()] })
                      input.value = ''
                    }
                  }
                }} />
                <Button variant="outline" onClick={() => {
                  const input = document.querySelector('input[placeholder="Add image URL"]') as HTMLInputElement
                  if (input?.value.trim()) {
                    onChange({ ...project, images: [...project.images, input.value.trim()] })
                    input.value = ''
                  }
                }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" value={project.github || ''} onChange={e => onChange({ ...project, github: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" value={project.links?.website || ''} onChange={e => onChange({ ...project, links: { playstore: project.links?.playstore || '', appstore: project.links?.appstore || '', website: e.target.value } })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="playstore">Play Store URL</Label>
                <Input id="playstore" value={project.links?.playstore || ''} onChange={e => onChange({ ...project, links: { playstore: e.target.value, appstore: project.links?.appstore || '', website: project.links?.website || '' } })} />
              </div>
              <div>
                <Label htmlFor="appstore">App Store URL</Label>
                <Input id="appstore" value={project.links?.appstore || ''} onChange={e => onChange({ ...project, links: { playstore: project.links?.playstore || '', appstore: e.target.value, website: project.links?.website || '' } })} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Organization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" value={project.org?.name || ''} onChange={e => onChange({ ...project, org: { name: e.target.value, logo: project.org?.logo || '', url: project.org?.url || '' } })} />
              </div>
              <div>
                <Label htmlFor="org-url">Organization URL</Label>
                <Input id="org-url" value={project.org?.url || ''} onChange={e => onChange({ ...project, org: { name: project.org?.name || '', logo: project.org?.logo || '', url: e.target.value } })} />
              </div>
            </div>
            <div>
              <Label htmlFor="org-logo">Organization Logo URL</Label>
              <Input id="org-logo" value={project.org?.logo || ''} onChange={e => onChange({ ...project, org: { name: project.org?.name || '', logo: e.target.value, url: project.org?.url || '' } })} />
            </div>
          </div>

          {!valid && (
            <div className="text-sm text-red-500">
              Missing: {[
                (!project.name || typeof project.name !== 'string' || !project.name.trim()) && 'name',
                (!project.desc || typeof project.desc !== 'string' || !project.desc.trim()) && 'description',
                !Array.isArray(project.tags) || project.tags.length === 0 && 'tags',
                !Array.isArray(project.images) || project.images.length === 0 && 'at least 1 image'
              ].filter(Boolean).join(', ')}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave} disabled={isSaving || !valid}>{isSaving ? 'Saving...' : (isNew ? 'Add Project' : 'Save Changes')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


