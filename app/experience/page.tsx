"use client";
import { useState, useEffect } from "react";
import { LargeTitle, SmallTitle } from "../components/section"
import { Pagination } from "@/components/ui/pagination"
import { fetchExperience } from "@/lib/client-fetch"
import { experienceType } from "../data/mock"
import ExperienceList from "../components/experience/experence-list"

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<experienceType[]>([]);
  const [totalExperiences, setTotalExperiences] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const experiencesPerPage = 5;
  const totalPages = Math.ceil(totalExperiences / experiencesPerPage);

  const loadExperiences = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchExperience({
        page,
        limit: experiencesPerPage
      });
      setExperiences(result.experiences);
      setTotalExperiences(result.total);
    } catch (err) {
      setError("Failed to load experiences. Please try again.");
      console.error("Error loading experiences:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-dvh px-4 py-32 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-2">
          <LargeTitle>Experience</LargeTitle>
          <SmallTitle>Timeline</SmallTitle>
        </div>
        
        {error && (
          <div className="mt-8 p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <ExperienceList experience={experiences} isLoading={isLoading} />

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {!isLoading && !error && totalExperiences > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {((currentPage - 1) * experiencesPerPage) + 1} to {Math.min(currentPage * experiencesPerPage, totalExperiences)} of {totalExperiences} experiences
          </div>
        )}
      </div>
    </main>
  )
}

