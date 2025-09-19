import { Section } from "../section"
import { Header } from "@/app/home-sections"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppData } from "@/lib/app-data-context"

export function StackShowcase() {
    const { skills } = useAppData()

  return (
    <Section id="stack">
      <Header
        title="Professional Skills & Tools"
        subtitle="My Best Friends in the Tech World"
      />

      <div className="flex flex-wrap gap-4 justify-center">
        {skills.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonBubble key={i} />
            ))
          : skills.map((item, i) => (
              <FloatingBubble key={i} label={item.name} delay={i * 0.2} />
            ))}
      </div>
    </Section>
  )
}

function FloatingBubble({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium shadow-sm cursor-pointer backdrop-blur-sm"
      initial={{ y: 0, x: 0 }}
      animate={{ y: [0, -15, 0], x: [0, 10, -10, 0] }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{
        scale: 1.2,
        rotate: 5,
        boxShadow: "0px 8px 25px rgba(59,130,246,0.4)",
      }}
    >
      {label}
    </motion.div>
  )
}

function SkeletonBubble() {
  return (
    <Skeleton className="h-10 w-24 rounded-full" />
  )
}
