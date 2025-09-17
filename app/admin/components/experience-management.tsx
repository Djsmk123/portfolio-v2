"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { experienceType, ExperienceType } from "@/app/data/mock";
import { useExperiences } from "./experience/use-experiences";
import { ExperienceCard } from "./experience/ExperienceCard";
import EditExperienceModal from "./experience/EditExperienceModal";

interface ExperienceManagementProps { onDataChange: () => void }

export default function ExperienceManagement ({ onDataChange }: ExperienceManagementProps) {
  const { items, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, type, setType, activeType, setActiveType, createExperience, updateExperience, removeExperience } = useExperiences()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editing, setEditing] = useState<experienceType | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const list = useMemo(() => items, [items])

  function addNew () {
    setEditing({ id: '', title: '', company: '', location: '', date: '', description: '', type: 'Full-time' as ExperienceType, isActive: true, createdAt: Date.now(), updatedAt: Date.now() })
    setIsAddingNew(true)
  }

  function onEdit (e: experienceType) { setEditing({ ...e }); setIsAddingNew(false) }
  function onDelete (id: string) { if (confirm('Delete experience?')) removeExperience(id) }

  async function onSave () {
    if (!editing) return
    try {
      //console   
      console.log('onSave', editing)
      setIsSaving(true)
      // small microtask delay to ensure latest modal edits are in state
      await Promise.resolve()
      if (isAddingNew) await createExperience(editing)
      else await updateExperience(editing)
      onDataChange()
      setEditing(null)
      setIsAddingNew(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative">
            <Input placeholder="Search experiences..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 w-64" />
          </div>
          {/* <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(activeType)} onValueChange={v => setActiveType(Number(v))}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="2">Inactive</SelectItem>
            </SelectContent>
          </Select> */}

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!selectedDate}
                className={cn(
                  "data-[empty=true]:text-muted-foreground w-[240px] justify-start text-left font-normal",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
            </PopoverContent>
          </Popover> */}
        </div>
        <Button onClick={addNew}>Add New Experience</Button>
      </div>

      <div className="space-y-4">
        {isFetching && <div className="text-sm text-muted-foreground">Loading experiences...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {list.map(exp => (
          <ExperienceCard key={exp.id} exp={exp} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
          <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= Math.max(1, Math.ceil(total / limit))}>Next</Button>
          <Select value={String(limit)} onValueChange={v => setLimit(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map(v => (<SelectItem key={v} value={String(v)}>{v} / page</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {editing && (
        <EditExperienceModal
          exp={editing}
          isNew={isAddingNew}
          open={true}
          onOpenChange={(o) => {
            if (!o) { setEditing(null); setIsAddingNew(false) }
          }}
          onChange={setEditing as (e: experienceType) => void}
          onSave={onSave}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

