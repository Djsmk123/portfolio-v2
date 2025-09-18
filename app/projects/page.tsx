"use client";
import {  projectType} from "@/app/data/mock";
import { LargeTitle, SmallTitle } from "../components/section";

import ProjectCard from "../components/projects/project-card";


export default function ProjectsPage() {
  return (
    <main className="min-h-dvh px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-2"> 
          <LargeTitle>Projects</LargeTitle>
          <SmallTitle>Selected mobile apps and experiments.</SmallTitle>
        </div>
        <ProjectList projects={[]} />
      </div>
    </main>
  );
}

//props
interface ProjectListProps {
  projects: projectType[]
}

export function ProjectList ({ projects }: ProjectListProps) {
  const safeProjects = Array.isArray(projects) ? projects : []
  if (safeProjects.length === 0) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full text-sm text-muted-foreground">No projects found</div>
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

