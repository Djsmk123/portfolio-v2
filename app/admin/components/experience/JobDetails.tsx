"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, MapPin } from 'lucide-react'
import type { experienceType } from '@/app/data/mock'

type Errors = Record<string, string>

type Props = {
  exp: experienceType
  errors: Errors
  onChange: (e: experienceType) => void
  setErrors: (e: Errors) => void
}

function JobDetails (props: Props) {
  const { exp, errors, onChange, setErrors } = props
  const [descDraft, setDescDraft] = useState(exp.description)

  useEffect(() => { setDescDraft(exp.description) }, [exp.description])

  // debounce description updates to avoid lag
  useEffect(() => {
    const id = setTimeout(() => {
      if (descDraft !== exp.description) onChange({ ...exp, description: descDraft })
    }, 200)
    return () => clearTimeout(id)
  }, [descDraft])

  const titleInvalid = useMemo(() => Boolean(errors.title), [errors.title])
  const companyInvalid = useMemo(() => Boolean(errors.company), [errors.company])
  const locationInvalid = useMemo(() => Boolean(errors.location), [errors.location])
  const descInvalid = useMemo(() => Boolean(errors.description), [errors.description])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          Job Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Senior Software Engineer"
          value={exp.title}
          onChange={e => {
            onChange({ ...exp, title: e.target.value })
            if (errors.title) setErrors({ ...errors, title: '' })
          }}
          className={titleInvalid ? 'border-red-500' : ''}
        />
        {titleInvalid && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium">
          Company <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company"
          placeholder="e.g., Tech Corp"
          value={exp.company}
          onChange={e => {
            onChange({ ...exp, company: e.target.value })
            if (errors.company) setErrors({ ...errors, company: '' })
          }}
          className={companyInvalid ? 'border-red-500' : ''}
        />
        {companyInvalid && <p className="text-xs text-red-500">{errors.company}</p>}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Location <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          placeholder="e.g., New York, NY"
          value={exp.location}
          onChange={e => {
            onChange({ ...exp, location: e.target.value })
            if (errors.location) setErrors({ ...errors, location: '' })
          }}
          className={locationInvalid ? 'border-red-500' : ''}
        />
        {locationInvalid && <p className="text-xs text-red-500">{errors.location}</p>}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Job Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your responsibilities, achievements, and key projects..."
          rows={5}
          value={descDraft}
          onChange={e => {
            setDescDraft(e.target.value)
            if (errors.description) setErrors({ ...errors, description: '' })
          }}
          className={`resize-none ${descInvalid ? 'border-red-500' : ''}`}
        />
        {descInvalid && <p className="text-xs text-red-500">{errors.description}</p>}
        <p className="text-xs text-muted-foreground">Tip: Use bullet points to highlight your key achievements</p>
      </div>
    </div>
  )
}

export default React.memo(JobDetails)


