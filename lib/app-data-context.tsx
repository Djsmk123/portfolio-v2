// app/context/AppDataContext.tsx
"use client"
import { createContext, useContext } from "react"
import { experienceType, postType, projectType, skillType } from "@/app/data/mock"
import { profileStatsType } from "@/app/data/type"
import { thoughtOfTheDayType } from "@/app/data/type"
type AppData = {
  skills: skillType[]
  stats: profileStatsType[]
  thought: thoughtOfTheDayType | null,
  projects: projectType[]
  blogs: postType[]
  experience: experienceType[]
}

const AppDataContext = createContext<AppData | null>(null)

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider")
  return ctx
}

export function AppDataProvider({ data, children }: { data: AppData; children: React.ReactNode }) {
  return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>
}
