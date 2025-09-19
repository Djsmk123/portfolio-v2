"use client"

import { useContext } from "react"
import Link from "next/link"
import GitHubCalendar from "react-github-calendar"
import { Section, LargeTitle, SmallTitle } from "./components/section"
import { Button } from "@/components/ui/button"
import { ThemeContext } from "./providers"
import BlurText from "@/components/ui/shadcn-io/blur-text"
import Stats from "./components/stats"
import ExperienceList from "./components/experience/experence-list"
import BlogComponent from "./components/blogs/blog-list"
import ContactPage from "./contact/page"
import {SocialLinks} from "./components/social-link/social-link"
import { useAppData } from "@/lib/app-data-context"
import { ProjectList } from "./components/projects/project-list"

// -------------------- Sections --------------------

export function ProjectsSection() {
  const { projectsData } = useAppData()
  if (projectsData.projects.length === 0) return null
  return (
    <Section id="projects">
      <Header title="Projects" subtitle="Selected work" />
      <ProjectList projects={
        projectsData.projects.length > 6 ? projectsData.projects.slice(0, 6) : projectsData.projects
      } />
      <div className="mt-6">
        <Link
          href="/projects"
          className="inline-flex h-10 items-center rounded-md border px-4"
        >
          Show all projects
        </Link>
      </div>
    </Section>
  )
}

export function BlogsSection() {
  return (
    <Section id="articles">
      <BlogComponent fromHome />
    </Section>
  )
}

export function ExperienceSection() {
  const { expData } = useAppData()
  if (expData.experiences.length === 0) return null
  return (
    <Section id="experience">
      <Header title="Experience" subtitle="Timeline" />
      <ExperienceList experience={expData.experiences.length > 3 ? expData.experiences.slice(0, 3) : expData.experiences} />
      <div className="mt-6">  
        <Link
          href="/experience"
          className="inline-flex h-10 items-center rounded-md border px-4"
        >
          Show all experience
        </Link>
      </div>
    </Section>
  )
}



export function ContactSection() {
  return (
    <Section id="contact">
      <ContactPage fromHome />
    </Section>
  )
}

// -------------------- Hero --------------------

export function Hero() {
  return (
    <Section id="home">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <HeroIntro />
        <HeroVideo />
      </div>

      <div className="mt-8 space-y-4">
        <div className="text-sm text-muted-foreground font-medium">
          Quantifying my journey
        </div>
        <Stats />
      </div>
    </Section>
  )
}

function HeroIntro() {
  return (
    <div className="space-y-6">
      <SmallTitle>Software Engineer</SmallTitle>
      <LargeTitle>MD. Mobin</LargeTitle>
      <BlurText
        text="Crafting high-performance Flutter, Swift, and React Native apps with a focus on seamless user experiences and scalability."
        className="text-muted-foreground"
      />

      <div className="flex flex-wrap gap-4">
        <VibrateButton href="/contact" variant="primary">
          Contact Me
        </VibrateButton>
        <VibrateButton
          href="/resume"
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resume
        </VibrateButton>
      </div>

      <SocialLinks />
    </div>
  )
}

function HeroVideo() {
  return (
    <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-muted">
      <video
        src="/assets/intro.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  )
}

// -------------------- Thought of the Day --------------------

 // -------------------- GitHub Stats --------------------
  
 export function GithubStats() {
  const isDark = useContext(ThemeContext).theme === "dark"

  return (
    <Section id="github">
      <Header title="Keyboard Warrior" subtitle="My GitHub Stats" />
      <div
        className={`p-4 rounded-lg border ${
          isDark ? "border-gray-600" : "border-gray-300"
        }`}
      >
        <GitHubCalendar
          username="djsmk123"
          blockSize={14}
          blockMargin={5}
          blockRadius={12}
          colorScheme={isDark ? "dark" : "light"}
          hideTotalCount
        />
      </div>
    </Section>
  )
}



// -------------------- Reusable Components --------------------

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2 pb-6">
      <LargeTitle>{title}</LargeTitle>
      <SmallTitle>{subtitle}</SmallTitle>
    </div>
  )
}

function VibrateButton({
  href,
  children,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: "primary" | "outline" }) {
  return (
    <Button asChild variant={variant === "primary" ? "default" : "outline"}>
      <Link
        href={href}
        {...props}
        onMouseEnter={() => {
          if ("vibrate" in navigator) navigator.vibrate(50)
        }}
        className="inline-flex h-10 items-center rounded-md px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
      >
        {children}
      </Link>
    </Button>
  )
}