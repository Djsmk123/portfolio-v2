import { projectType } from "@/app/data/mock"
import ProjectCard from "./project-card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectListProps {
  projects: projectType[]
  isLoading?: boolean
}

export function ProjectList({ projects, isLoading = false }: ProjectListProps) {
  const safeProjects = Array.isArray(projects) ? projects : []

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (safeProjects.length === 0) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full text-sm text-muted-foreground text-center py-8">
          No projects found
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {safeProjects.map(p => (
        <ProjectCard key={p.id} p={p} />
      ))}
    </div>
  )
}