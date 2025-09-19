"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillCard from "./skills/SkillCard";
import EditSkillModal from "./skills/EditSkillModal";
import { useSkills, type Skill } from "./skills/use-skills";

interface Props { onDataChange: () => void }

export default function SkillsManagement ({ onDataChange }: Props) {
  const { skills, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, createSkill, updateSkill, removeSkill } = useSkills()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const list = useMemo(() => skills, [skills])

  function addNew () {
    setEditing({ id: '', name: '', category: 'frontend', level: 'Beginner', yearsOfExperience: 0, color: '#61DAFB', is_active: true })
    setIsAddingNew(true)
  }

  function onEdit (s: Skill) { setEditing({ ...s }); setIsAddingNew(false) }
  function onDelete (id: string) { if (confirm('Delete skill?')) removeSkill(id) }

  async function onSave () {
    if (!editing) return
    try {
      setIsSaving(true)
      if (isAddingNew) await createSkill(editing)
      else await updateSkill(editing)
      onDataChange()
      setEditing(null)
      setIsAddingNew(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search skills..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 w-full sm:w-64" />
        </div>
        <Button onClick={addNew} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Add New Skill</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching && <div className="col-span-full text-sm text-muted-foreground">Loading skills...</div>}
        {error && <div className="col-span-full text-sm text-red-500">{error}</div>}
        {list.map(skill => (
          <SkillCard key={skill.id} skill={skill} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="text-sm text-muted-foreground w-full sm:w-auto">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total</div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="w-full sm:w-auto">Prev</Button>
          <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= Math.max(1, Math.ceil(total / limit))} className="w-full sm:w-auto">Next</Button>
          <div className="w-full sm:w-auto">
            <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
              <SelectTrigger className="w-full sm:w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>{[12, 24, 36, 48].map(v => (<SelectItem key={v} value={v.toString()}>{v} / page</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {editing && (
        <EditSkillModal
          skill={editing}
          isNew={isAddingNew}
          onChange={setEditing as (s: Skill) => void}
          onCancel={() => { setEditing(null); setIsAddingNew(false) }}
          onSave={onSave}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

