"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  Code2, FileText, GitCommit, Eye, Star, Calendar, Users, Terminal 
} from "lucide-react"
import { profileStatsType } from "../data/type"
import { useAppData } from "@/lib/app-data-context"
import { Skeleton } from "@/components/ui/skeleton"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Experience: Calendar,
  Projects: Code2,
  Articles: FileText,
  Commits: GitCommit,
  Views: Eye,
  Stars: Star,
  Loc: Terminal,
  Clients: Users,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

// CountUp hook
function useCountUp(end: number, duration = 1.2) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!end) return
    let start = 0
    const step = () => {
      start += 16 / (duration * 1000)
      const progress = Math.min(start, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration])
  return count
}

function StatItem({ stat }: { stat: profileStatsType }) {
  const Icon = ICON_MAP[stat.label] || Calendar
  const match = stat.value.toString().match(/^(\d+)(.*)$/)
  const numericValue = match ? parseInt(match[1], 10) : NaN
  const suffix = match ? match[2] : ""
  const hasNumber = !isNaN(numericValue)
  const count = useCountUp(hasNumber ? numericValue : 0)
  const displayValue = hasNumber ? `${count}${suffix}` : stat.value

  return (
    <motion.div
      variants={{item}}
      whileHover={{ scale: 1.08, rotateY: 3, rotateX: -3 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="group relative min-w-0"
    >
      <div className="flex flex-col items-center p-3 rounded-lg border bg-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 w-full">
        <motion.div
          className={`p-3 rounded-full ${stat.bgColor} mb-2`}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </motion.div>
        <div className="text-center w-full min-w-0">
          <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
            {displayValue}
          </div>
          <div className="text-xs text-muted-foreground font-medium leading-tight mt-1 truncate w-full">
            {stat.label}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton while loading

export default function Stats() {
  const { stats,blogs } = useAppData()

  //assign blog length to stats
  stats.forEach((stat) => {
    if (stat.label === "Articles") stat.value = blogs.length
  })

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8 max-w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {stats.length === 0
        ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
        : stats.map((stat) => <StatItem key={stat.label} stat={stat} />)}
    </motion.div>
  )
}
