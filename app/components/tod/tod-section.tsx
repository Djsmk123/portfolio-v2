"use client"

import { Section } from "../section"
import { ThoughtCard } from "./tod-components"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppData } from "@/lib/app-data-context"

export function ThoughtOfTheDay() {
  const { thought } = useAppData()

  // If thought is not yet available, show skeleton loader
  if (!thought) {
    return (
      <Section id="thought">
        <div className="group rounded-2xl border bg-background/50 backdrop-blur p-6 md:p-8">
          {/* Top row: play button + waveform */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex items-end gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`w-1 rounded-sm h-${6 + i * 2}`}
                />
              ))}
            </div>
          </div>

          {/* Quote + Author */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-6 w-6 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          </div>
        </div>
      </Section>
    )
  }

  // When loaded, render the actual ThoughtCard
  return (
    <Section id="thought">
      <ThoughtCard quote={thought.quote} author={thought.author} url={thought.url} />
    </Section>
  )
}
