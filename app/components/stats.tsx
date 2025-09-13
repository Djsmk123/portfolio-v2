"use client"

import { profileStats } from "@/app/data/mock"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { 
  Code2, FileText, GitCommit, Eye, Star, Calendar, Users, Terminal 
} from "lucide-react"

const stats = [
  {
    label: "Projects",
    value: profileStats.totalProjects,
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Mobile & Web Apps",
  },
  {
    label: "Experience",
    value: `${profileStats.yearsOfExperience}+`,
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Years in Tech",
  },
  {
    label: "Articles",
    value: profileStats.blogsWritten,
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Blog Posts",
  },
  {
    label: "Commits",
    value: profileStats.totalCommits.toLocaleString(),
    icon: GitCommit,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    description: "Git Contributions",
  },
  {
    label: "Views",
    value: `${(profileStats.websiteViews / 1000).toFixed(1)}K`,
    icon: Eye,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    description: "Website Visitors",
  },
  {
    label: "Stars",
    value: profileStats.githubStars,
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    description: "GitHub Stars",
  },
  {
    label: "Clients",
    value: profileStats.clientsServed,
    icon: Users,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Happy Clients",
  },
  {
    label: "Lines of Code",
    value: `${(profileStats.linesOfCode / 1000).toFixed(0)}K`,
    icon: Terminal,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Code Written",
  },
]

// Counter hook
function useCountUp(end: number, duration = 1.2) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = (timestamp: number) => {
      start += 16 / (duration * 1000)
      const progress = Math.min(start, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration])
  return count
}

export default function Stats() {
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

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8 max-w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        const isNumber = !isNaN(Number(stat.value.toString().replace(/[^0-9]/g, "")))
        const endValue = isNumber ? parseInt(stat.value.toString()) : undefined
        const count = endValue ? useCountUp(endValue) : stat.value

        return (
          <motion.div
            key={stat.label}
            variants={{item}}
            whileHover={{ scale: 1.08, rotateY: 3, rotateX: -3 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="group relative min-w-0"
          >
            <div className="flex flex-col items-center p-3 rounded-lg border bg-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 w-full">
              {/* Pulsing Icon */}
              <motion.div
                className={`p-3 rounded-full ${stat.bgColor} mb-2`}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </motion.div>

              <div className="text-center w-full min-w-0">
                <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {endValue ? count : stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium leading-tight mt-1 truncate w-full">
                  {stat.label}
                </div>
              </div>
            </div>

            {/* Tooltip */}
            <motion.div
              className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none z-10"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              <div className="bg-popover/90 text-popover-foreground text-xs px-3 py-1.5 rounded-md shadow-lg border whitespace-nowrap backdrop-blur-sm">
                {stat.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover/90 border-r border-b" />
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
