"use client"
import { fetchBlogs, fetchExperience, fetchProjects, fetchSkills, fetchStats, fetchThoughtOfTheDay } from "@/lib/client-fetch"
import { useEffect, useState, useRef } from "react"
import { AppDataProvider } from "@/lib/app-data-context"
import type { experienceType, postType, projectType, skillType } from "@/app/data/mock"
import type { profileStatsType, thoughtOfTheDayType } from "@/app/data/type"

// Global cache to persist data across route changes
type AppDataCache = {
  skills: skillType[]
  stats: profileStatsType[]
  thought: thoughtOfTheDayType | null
  projectsData: { projects: projectType[]; total: number }
  blogs: postType[]
  expData: { experiences: experienceType[]; total: number }
} | null

let globalDataCache: AppDataCache = null
let isDataLoading = false
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Function to clear cache (useful for data refresh)
export const clearAppDataCache = () => {
  globalDataCache = null
  isDataLoading = false
  cacheTimestamp = 0
}

// Check if cache is still valid
const isCacheValid = () => {
  return globalDataCache && (Date.now() - cacheTimestamp) < CACHE_DURATION
}

export function BootSequence({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<AppDataCache>(globalDataCache)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // If data is already cached and valid, use it immediately
    if (isCacheValid()) {
      setData(globalDataCache)
      setReady(true)
      return
    }

    // Prevent multiple simultaneous API calls
    if (isDataLoading) {
      return
    }

    const fetchData = async () => {
      isDataLoading = true
      try {
        const [stats, thought, skills, projectsData, expData, blogs] = await Promise.all([
          fetchStats(),
          fetchThoughtOfTheDay(),
          fetchSkills(),
          fetchProjects({ page: 1, limit: 10 }), // Get first 10 projects for home page
          fetchExperience({ page: 1, limit: 10 }), // Get first 10 experiences for home page
          fetchBlogs(), 
        ])
        
        const fetchedData = { 
          stats, 
          thought, 
          skills, 
          projectsData, 
          expData, 
          blogs 
        }
        
        // Cache the data globally with timestamp
        globalDataCache = fetchedData
        cacheTimestamp = Date.now()
        setData(fetchedData)
        setReady(true)
      } catch (error) {
        console.error("Error fetching app data:", error)
        setReady(true) // Still show the app even if data fetch fails
      } finally {
        isDataLoading = false
      }
    }

    if (!hasInitialized.current) {
      hasInitialized.current = true
      fetchData()
    }
  }, [])

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-background">
        <div className="w-[90vw] max-w-md rounded-lg border p-6 font-mono text-sm">
          <p> booting portfolio OS...</p>
          <p className="mt-2">loading ui modules... <span className="animate-pulse">█</span></p>
          <p className="mt-2">spawning shaders... ok</p>
          <p className="mt-2">connecting github... ok</p>
        </div>
      </div>
    )
  }

  return <AppDataProvider data={data as NonNullable<AppDataCache>}>{children}</AppDataProvider>
}