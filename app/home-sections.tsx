"use client"

import { useContext, useState, useRef } from "react"
import Link from "next/link"
import GitHubCalendar from "react-github-calendar"
import { Section, LargeTitle, SmallTitle } from "./components/section"
import { Button } from "@/components/ui/button"
import { ThemeContext } from "./providers"
import BlurText from "@/components/ui/shadcn-io/blur-text"
import Stats from "./components/stats"
import ExperienceList from "./components/experience/experence-list"
import ContactPage from "./contact/page"
import {SocialLinks} from "./components/social-link/social-link"
import { useAppData } from "@/lib/app-data-context"
import { ProjectList } from "./components/projects/project-list"
import { BlogList } from "./components/blogs/blog-list"

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
  const { blogs } = useAppData()
  if (blogs.length === 0) return null
  
  return (
    (
      <Section id="articles">
        <div className="space-y-2">
          <LargeTitle>Articles</LargeTitle>
          <SmallTitle>What I&apos;ve been writing</SmallTitle>
          <BlogList posts={blogs.slice(0, 3)} />
        </div>
        <div className="mt-6">
          <Link href="/blogs" className="inline-flex h-10 items-center rounded-md border px-4">Show all articles</Link>
        </div>
      </Section>
    )
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
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  return (
    <div 
      className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-muted relative group cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src="https://hrarzkdrpxlsjvyxyvab.supabase.co/storage/v1/object/public/portfolioDev/qfrcwlkma1irgxh1t19d6feo_watermarked.mp4"
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
          className="bg-white/90 hover:bg-white text-black rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleMute()
        }}
        className={`absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>

      {/* Play/Pause Indicator */}
      <div 
        className={`absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {isPlaying ? 'Playing' : 'Paused'}
      </div>

      {/* Volume Indicator */}
      <div 
        className={`absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {isMuted ? 'Muted' : 'Unmuted'}
      </div>
    </div>
  )
}

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