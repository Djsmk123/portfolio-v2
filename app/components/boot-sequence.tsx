"use client"
import { fetchBlogs, fetchExperience, fetchProjects, fetchSkills, fetchStats, fetchThoughtOfTheDay } from "@/lib/client-fetch"
import { useEffect, useState } from "react"
import { AppDataProvider } from "@/lib/app-data-context"

export function BootSequence({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [stats, thought, skills, projects, experience, blogs] = await Promise.all([
        fetchStats(),
        fetchThoughtOfTheDay(),
        fetchSkills(),
        fetchProjects(),
        fetchExperience(),
        fetchBlogs(), 
      ])
      setData({ stats, thought, skills, projects, experience, blogs })
      setReady(true)
    }
    fetchData()
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

  return <AppDataProvider data={data}>{children}</AppDataProvider>
}