  "use client";

  import { useMemo, useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Search, Plus } from "lucide-react";
  import type { projectType } from "@/app/data/type";
  import { useProjects } from "./projects/use-projects";
  import { EditProjectModal } from "./projects/EditProjectModal";
  import { AdminProjectCard } from "./projects/ProjectCard";
  import {   Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, } from "@/components/ui/select";
import { toast } from "sonner";

  interface ProjectsManagementProps {
    onDataChange: () => void;
  }

  export default function ProjectsManagement ({ onDataChange }: ProjectsManagementProps) {
    const { projects, isFetching, error, page, limit, total, setPage, setLimit, query, setQuery, createProject, updateProject, removeProject } = useProjects()
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingProject, setEditingProject] = useState<projectType | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const filtered = useMemo(() => projects, [projects])

    function addNewProject () {
      setEditingProject({ id: '', name: '', desc: '', tags: [], images: [], links: { playstore: '', appstore: '', website: '' }, org: { name: '', logo: '', url: '' }, createdAt: Date.now(), updatedAt: Date.now() })
      setIsAddingNew(true)
    }

    function editProject (p: projectType) {
      setEditingProject({ ...p })
      setIsAddingNew(false)
    }

    function deleteProject (id: string) {
      if (confirm('Are you sure you want to delete this project?')) {
        removeProject(id)
        toast.success('Project deleted successfully')
      }
    }

    async function saveProject () {
      if (!editingProject) return
      try {
        setIsSaving(true)
        if (isAddingNew) await createProject(editingProject)
        else updateProject(editingProject)
        onDataChange()
        setEditingProject(null)
        setIsAddingNew(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error saving project')
      } finally {
        setIsSaving(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search projects..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 w-full sm:w-64" />
          </div>
          <Button onClick={addNewProject} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Add New Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching && <div className="col-span-full text-sm text-muted-foreground">Loading projects...</div>}
          {error && <div className="col-span-full text-sm text-red-500">{error}</div>}
          {filtered.map(project => (
            <AdminProjectCard key={project.id} project={project} onEdit={editProject} onDelete={deleteProject} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-sm text-muted-foreground w-full sm:w-auto">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total</div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="w-full sm:w-auto">Prev</Button>
            <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= Math.max(1, Math.ceil(total / limit))} className="w-full sm:w-auto">Next</Button>
            <div className="w-full sm:w-auto">
              <LimitSelect limit={limit} setLimit={setLimit} />
            </div>
          </div>
        </div>

        {editingProject && (
          <EditProjectModal
            project={editingProject}
            isNew={isAddingNew}
            onChange={setEditingProject as (p: projectType) => void}
            onCancel={() => { setEditingProject(null); setIsAddingNew(false) }}
            onSave={saveProject}
            isSaving={isSaving}
          />
        )}
      </div>
    )
  }
  
  type Props = {
    limit: number
    setLimit: (value: number) => void
    name?: string
  }
  
  export function LimitSelect({ limit, setLimit, name = 'projects' }: Props) {
    return (
      <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
        <SelectTrigger className="w-[120px] text-foreground bg-background border-border focus:ring-ring">
          <SelectValue
            placeholder="Select items per page"
            className="text-foreground placeholder:text-muted-foreground"
          />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground border-border">
          {[10, 20, 30, 40, 50].map((v) => (
            <SelectItem
              key={v}
              value={v.toString()}
              className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
              {v} {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }