"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { Skill } from './use-skills'
import { Badge } from '@/components/ui/badge'

type Props = {
  skill: Skill
  onEdit: (s: Skill) => void
  onDelete: (id: string) => void
}

export default function SkillCard ({ skill, onEdit, onDelete }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200"
              style={{
                backgroundColor: skill.color ? skill.color : '#ccc'
              }}
            >
              <span className="text-lg font-bold text-white select-none">
                {skill.name?.charAt(0)?.toUpperCase() || ''}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{skill.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{skill.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(skill)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(skill.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Level</span>
            <Badge variant="outline">{skill.level}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Experience</span>
            <span className="text-sm font-medium">{skill.yearsOfExperience} years</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


