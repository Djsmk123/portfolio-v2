"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Building, Calendar, MapPin } from 'lucide-react'
import type { experienceType } from '@/app/data/type'

type Props = {
  exp: experienceType
  onEdit: (e: experienceType) => void
  onDelete: (id: string) => void
}

export function ExperienceCard ({ exp, onEdit, onDelete }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg truncate">{exp.title}</h3>
                <p className="text-muted-foreground truncate">{exp.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{exp.location}</div>
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{exp.date}</div>
              <Badge variant="outline">{exp.type}</Badge>
              <Badge className={exp.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {exp.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2">{exp.description}</p>
          </div>

          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="sm" onClick={() => onEdit(exp)}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


