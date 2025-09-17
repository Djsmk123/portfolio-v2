"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Skill } from './use-skills'

type Props = {
  skill: Skill
  isNew: boolean
  onChange: (s: Skill) => void
  onCancel: () => void
  onSave: () => void
  isSaving: boolean
}

export default function EditSkillModal ({ skill, isNew, onChange, onCancel, onSave, isSaving }: Props) {
  const valid = skill.name.trim()
  const suggestions = [
    '#61DAFB', // React
    '#3178C6', // TypeScript
    '#000000', // Next.js / Express
    '#06B6D4', // TailwindCSS
    '#339933', // Node.js
    '#336791', // PostgreSQL
    '#3ECF8E', // Supabase
    '#02569B', // Flutter
    '#0175C2', // Dart
    '#FF9900', // AWS
    '#4285F4', // GCP
    '#F24E1E', // Figma
    '#2496ED', // Docker
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isNew ? 'Add New Skill' : 'Edit Skill'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={skill.name} onChange={e => onChange({ ...skill, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={skill.category} onChange={e => onChange({ ...skill, category: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={skill.level} onValueChange={(v) => onChange({ ...skill, level: v as Skill['level'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Beginner','Intermediate','Advanced','Expert'].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yoe">Years</Label>
              <Input id="yoe" type="number" min={0} max={50} value={skill.yearsOfExperience} onChange={e => onChange({ ...skill, yearsOfExperience: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" placeholder="#61DAFB" value={skill.color || ''} onChange={e => onChange({ ...skill, color: e.target.value })} />
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map(hex => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={`Use ${hex}`}
                    title={hex}
                    className="h-6 w-6 rounded-md border"
                    style={{ backgroundColor: hex }}
                    onClick={() => onChange({ ...skill, color: hex })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave} disabled={isSaving || !valid}>{isSaving ? 'Saving...' : (isNew ? 'Add Skill' : 'Save Changes')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


