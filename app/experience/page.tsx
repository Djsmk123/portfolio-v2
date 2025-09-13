"use client";
import ExperienceList from "../components/experience/experence-list"
import { LargeTitle, SmallTitle } from "../components/section"

export default function ExperiencePage () {
  return (
    <main className="min-h-dvh px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-2">
          <LargeTitle>Experience</LargeTitle>
          <SmallTitle>Timeline</SmallTitle>
        </div>
        <ExperienceList />
      </div>
    </main>
  )
}

