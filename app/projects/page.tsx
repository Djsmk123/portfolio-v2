"use client";

import { useState, useEffect } from "react";
import { LargeTitle, SmallTitle } from "../components/section";
import { ProjectList } from "../components/projects/project-list";
import { Pagination } from "@/components/ui/pagination";
import { fetchProjects } from "@/lib/client-fetch";
import { projectType } from "../data/mock";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<projectType[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectsPerPage = 9; // 3 columns × 3 rows
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  const loadProjects = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchProjects({
        page,
        limit: projectsPerPage
      });
      setProjects(result.projects);
      setTotalProjects(result.total);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-dvh px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-2"> 
          <LargeTitle>Projects</LargeTitle>
          <SmallTitle>Selected mobile apps and experiments.</SmallTitle>
        </div>
        
        {error && (
          <div className="mt-8 p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <ProjectList projects={projects} isLoading={isLoading} />

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {!isLoading && !error && totalProjects > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {((currentPage - 1) * projectsPerPage) + 1} to {Math.min(currentPage * projectsPerPage, totalProjects)} of {totalProjects} projects
          </div>
        )}
      </div>
    </main>
  );
}

//props


