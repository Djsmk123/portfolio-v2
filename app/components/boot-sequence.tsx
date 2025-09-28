"use client"
import { fetchBlogs, fetchExperience, fetchProjects, fetchSkills, fetchStats, fetchThoughtOfTheDay } from "@/lib/client-fetch"
import { useEffect, useState, useRef, useCallback } from "react"
import { AppDataProvider } from "@/lib/app-data-context"
import type { experienceType, postType, projectType, skillType } from "@/app/data/type"
import type { profileStatsType, thoughtOfTheDayType } from "@/app/data/type"
import { motion } from "framer-motion"

// ----------------------
// Global cache
// ----------------------
type AppDataCache = {
  skills: skillType[]
  stats: profileStatsType[]
  thought: thoughtOfTheDayType | null
  projectsData: { projects: projectType[]; total: number }
  blogs: postType[]
  expData: { experiences: experienceType[]; total: number }
}

type CacheState = {
  data: AppDataCache | null
  timestamp: number
  isLoading: boolean
}

const cacheState: CacheState = {
  data: null,
  timestamp: 0,
  isLoading: false
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000

// ----------------------
// Cache helpers
// ----------------------
export const clearAppDataCache = () => {
  cacheState.data = null
  cacheState.isLoading = false
  cacheState.timestamp = 0
}

const isCacheValid = () => {
  return cacheState.data && (Date.now() - cacheState.timestamp) < CACHE_DURATION
}

const withRetry = async <T,>(
  fn: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (attempts > 1) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return withRetry(fn, attempts - 1, delay * 1.5)
    }
    throw error
  }
}

// ----------------------
// Loading screen
// ----------------------
const loadingSteps = [
  "booting portfolio OS...",
  "loading ui modules...",
  "spawning shaders...",
  "connecting github...",
  "initializing data streams...",
  "ready!"
]

function LoadingScreen({ step, error, retry }: { step: number; error?: string | null; retry?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background text-primary-foreground">
      <div className="w-[90vw] max-w-md rounded-lg border p-6 font-mono text-sm shadow-lg bg-background/80 backdrop-blur">
        {loadingSteps.map((text, index) => {
          const isActive = index === step
          const isDone = index < step

          return (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`mt-2 ${
                isActive ? "text-primary" : isDone ? "text-green-400" : "opacity-50"
              }`}
            >
              {text}
              {isActive && index < loadingSteps.length - 1 && (
                <span className="inline-block animate-pulse ml-2">...</span>
              )}
              {isDone && " ✓"}
            </motion.p>
          )
        })}

        {/* Progress bar */}
        <div className="mt-6 h-1 w-full bg-muted rounded overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (loadingSteps.length - 1)) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-4 border-t pt-4">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={retry}
              className="mt-2 rounded bg-red-500/20 px-3 py-1 text-xs hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ----------------------
// BootSequence
// ----------------------
type BootSequenceProps = {
  children: React.ReactNode
  onDataLoaded?: (data: AppDataCache) => void
  onError?: (error: Error) => void
  enableRetry?: boolean
}

export function BootSequence({
  children,
  onDataLoaded,
  onError,
  enableRetry = true
}: BootSequenceProps) {
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<AppDataCache | null>(cacheState.data)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  const fetchDataWithRetry = useCallback(async () => {
    const fetchFn = async () => {
      setLoadingStep(1)

      const [stats, thought, skills, projectsData, expData, blogs] = await Promise.all([
        fetchStats(),
        fetchThoughtOfTheDay(),
        fetchSkills(),
        fetchProjects({ page: 1, limit: 10 }),
        fetchExperience({ page: 1, limit: 10 }),
        fetchBlogs(),
      ])

      setLoadingStep(4)

      return {
        stats,
        thought,
        skills,
        projectsData,
        expData,
        blogs
      }
    }

    return enableRetry ? withRetry(fetchFn) : fetchFn()
  }, [enableRetry])

  useEffect(() => {
    if (isCacheValid() && cacheState.data) {
      setData(cacheState.data)
      setReady(true)
      setLoadingStep(loadingSteps.length - 1)
      return
    }

    if (cacheState.isLoading) return

    const fetchData = async () => {
      if (hasInitialized.current) return
      hasInitialized.current = true

      cacheState.isLoading = true
      setError(null)
      setLoadingStep(0)

      try {
        const fetchedData = await fetchDataWithRetry()

        cacheState.data = fetchedData
        cacheState.timestamp = Date.now()

        setData(fetchedData)
        setLoadingStep(loadingSteps.length - 1)

        onDataLoaded?.(fetchedData)

        await new Promise(resolve => setTimeout(resolve, 500))
        setReady(true)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to load data"
        console.error("Error fetching app data:", error)
        setError(errorMsg)
        onError?.(error instanceof Error ? error : new Error(errorMsg))
        setTimeout(() => setReady(true), 2000)
      } finally {
        cacheState.isLoading = false
      }
    }

    fetchData()
  }, [fetchDataWithRetry, onDataLoaded, onError])

  const retry = () => {
    hasInitialized.current = false
    setReady(false)
    setError(null)
    clearAppDataCache()
  }

  if (!ready) {
    return <LoadingScreen step={loadingStep} error={error} retry={retry} />
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Portfolio Unavailable</h2>
        <p className="text-muted-foreground mb-4">
          Unable to load portfolio data. Please try again later.
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return <AppDataProvider data={data}>{children}</AppDataProvider>
}

// ----------------------
// Manual refresh hook
// ----------------------
export const useAppDataRefresh = () => {
  return useCallback(() => {
    clearAppDataCache()
    window.location.reload()
  }, [])
}
