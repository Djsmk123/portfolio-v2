"use client";
import BlurText from "@/components/ui/shadcn-io/blur-text";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSpeachSynthesisApi } from "./hooks/useSpeechSynthesis";
import { motion } from "framer-motion";
import { BlogsSection, ContactSection, ExperienceSection, ProjectsSection } from "./useless";
import Stats from "./components/stats";
import GitHubCalendar from 'react-github-calendar';

import {
  XIcon,
  GithubIcon,
  LinkedinIcon,
} from "lucide-react";
export default function Home() {
  // const [isGameOpen, setIsGameOpen] = useState(false);

  // const handleStartGame = () => {
  //   setIsGameOpen(true);
  // };

  // const handleCloseGame = () => {
  //   setIsGameOpen(false);
  // };

  return (
    <main>
      <div className="py-12">
      <Hero/>
        <ThoughtOfTheDay />
        <StackShowcase />
        <GithubStats />
        <ProjectsSection />
        <ExperienceSection />
        <BlogsSection />
        <ContactSection />
        {/* <GameModal isOpen={isGameOpen} onClose={handleCloseGame} />
        <ScrollGameInvite onStartGame={handleStartGame} /> */}
      </div>
    </main>
  );
}

import Link from "next/link";
import { Section, LargeTitle, SmallTitle } from "./components/section";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "./providers";

function Hero() {
  return (
    <Section id="home">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-6">
          <SmallTitle>Software Engineer</SmallTitle>
          <LargeTitle>
            MD. Mobin
          </LargeTitle>
          <BlurText
            text="Crafting high-performance Flutter, Swift, and React Native apps with a focus on seamless user experiences and scalability."
            className="text-muted-foreground"
          />
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                onMouseEnter={() => {
                  if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                  }
                }}
              >
                Contact Me
              </Link>
            </Button>
     
            <Button asChild variant="outline">
              <Link
                href="/resume.pdf"
                className="inline-flex h-10 items-center rounded-md px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary hover:text-primary-foreground active:scale-95"
                download
                onMouseEnter={() => {
                  if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                  }
                }}
              >
                Download Resume
              </Link>
            </Button>
            </div>
            
            {/* Stats Section */}
        
            
            <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <Link
              href="https://www.linkedin.com/in/your-profile"
              aria-label="LinkedIn"
              className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-muted transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="size-4" />
            </Link>
            <Link
              href="https://github.com/your-handle"
              aria-label="GitHub"
              className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-muted transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" />
            </Link>
            <Link
              href="https://x.com/your-handle"
              aria-label="X (Twitter)"
              className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-muted transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon className="size-4" />
            </Link>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-muted">
          <video src={"/assets/intro.mp4"} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
                <div className="text-sm text-muted-foreground font-medium">Quantifying my journey</div>
              <div className="w-full">
                <Stats />
              </div>
            </div>
    </Section>
  );
}


function ThoughtOfTheDay() {
  const thoughts = [
    {
      quote:
        "Great software is born when empathy meets engineering.",
      author: "— Unknown",
    },
    {
      quote: "Performance is a feature. Design it in, not bolt it on.",
      author: "— Engineering Maxim",
    },
    {
      quote: "Small, consistent wins compound into great products.",
      author: "— Product Wisdom",
    },
    {
      quote: "Code is read far more than it's written. Optimize for clarity.",
      author: "— Pragmatic Principle",
    },
  ];

  const dayIndex = new Date().getDate() % thoughts.length;
  const { quote, author } = thoughts[dayIndex];
  const words = useMemo(() => quote.split(" "), [quote]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [bars, setBars] = useState<number[]>(() => new Array(24).fill(4));

  // Reset when quote changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setBars(new Array(24).fill(4));
  }, [quote]);

  // Word-by-word playback
  useEffect(() => {
    if (!isPlaying) return;
    if (currentWordIndex >= words.length) {
      setIsPlaying(false);
      return;
    }
    const intervalId = window.setInterval(() => {
      setCurrentWordIndex((prev) => {
        const next = prev + 1;
        if (next >= words.length) {
          window.clearInterval(intervalId);
        }
        return next;
      });
    }, 200);
    return () => window.clearInterval(intervalId);
  }, [isPlaying, words.length, currentWordIndex]);

  // Reactive waveform
  useEffect(() => {
    const tick = () => {
      setBars((prev) =>
        prev.map(() => (isPlaying ? Math.floor(6 + Math.random() * 28) : Math.max(4, Math.floor(0.7 * (6 + Math.random() * 8)))))
      );
    };
    const id = window.setInterval(tick, isPlaying ? 120 : 300);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const displayed = words.slice(0, currentWordIndex).join(" ");

  // TTS hook
  const {
    setText: setTtsText,
    speak: ttsSpeak,
    pause: ttsPause,
    cancel: ttsCancel,
  } = useSpeachSynthesisApi();

  // keep TTS text in sync with the quote
  useEffect(() => {
    setTtsText(quote);
    // stop any previous utterance on quote change
    ttsCancel();
  }, [quote, setTtsText, ttsCancel]);

  return (
    <Section id="thought">
      <div className="relative isolate overflow-hidden">
        <div className="absolute -inset-16 -z-10 opacity-30 blur-3xl [mask-image:radial-gradient(closest-side,white,transparent)]">
          <div className="size-64 rounded-full bg-gradient-to-tr from-primary/40 to-purple-500/40 animate-pulse" />
        </div>
        <div className="space-y-2 mb-6">  
          <LargeTitle>Thought of the day</LargeTitle>
        </div>

        <div className="group rounded-2xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/40 p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/40">
          <div className="mb-4 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                if (!isPlaying && currentWordIndex >= words.length) {
                  setCurrentWordIndex(0);
                }
                const nextState = !isPlaying;
                setIsPlaying(nextState);
                if (nextState) {
                  // start TTS
                  ttsSpeak();
                } else {
                  // pause TTS to allow resume
                  ttsPause();
                }
                if ('vibrate' in navigator) {
                  navigator.vibrate(30);
                }
              }}
              className="h-9 px-4 rounded-md border bg-background/80 hover:bg-background transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
            >
              {isPlaying ? (
                <>
                  <span className="text-lg">⏸</span>
                  Pause
                </>
              ) : (
                <>
                  <span className="text-lg">▶</span>
                  Play
                </>
              )}
            </button>

         

            <div className="flex items-end gap-[3px] h-8" aria-hidden>
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-primary/70 transition-[height,opacity] duration-200"
                  style={{ height: `${h}px`, opacity: isPlaying ? 1 : 0.6 }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="size-10 md:size-12 rounded-full bg-primary/10 grid place-items-center text-primary">
                <span className="text-2xl md:text-3xl transition-transform duration-500 group-hover:rotate-6">“</span>
              </div>
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
            </div>
            <div className="space-y-2">
              <p className="text-lg md:text-xl leading-relaxed min-h-[1.75rem] md:min-h-[2rem]">
                {currentWordIndex === 0 && !isPlaying ? quote : displayed}
                {isPlaying && currentWordIndex < words.length ? <span className="inline-block w-2 h-4 bg-primary/60 align-baseline ml-1 animate-pulse" /> : null}
              </p>
              <p className="text-muted-foreground">{author}</p>
            </div>
          </div>

          
        </div>
      </div>
    </Section>
  );
}





function FloatingBubble({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium shadow-sm cursor-pointer backdrop-blur-sm"
      initial={{ y: 0, x: 0 }}
      animate={{ 
        y: [0, -15, 0], 
        x: [0, 10, -10, 0] 
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{
        scale: 1.2,
        rotate: 5,
        boxShadow: "0px 8px 25px rgba(59,130,246,0.4)", // glowing effect
      }}
    >
      {label}
    </motion.div>
  );
}

export function StackShowcase() {
  const stack = [
    "Dart",
    "Flutter",
    "Swift",
    "SwiftUI",
    "Kotlin",
    "React Native",
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "Figma",
  ];

  return (
    <Section id="stack">
      <div className="space-y-10">
        <div className="space-y-2">
          <LargeTitle>Professional Skills & Tools</LargeTitle>
          <SmallTitle>My Best Friends in the Tech World</SmallTitle>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {stack.map((item, i) => (
            <FloatingBubble key={i} label={item} delay={i * 0.2} />
          ))}
        </div>
      </div>
    </Section>
  );
}


export function GithubStats() {
  const isDarkMode = useContext(ThemeContext).theme === "dark"
  
  return (
    <Section id="github">
      <div className="space-y-2 pb-6">
        <LargeTitle>Keyboard Warrior</LargeTitle>
        <SmallTitle>My GitHub Stats</SmallTitle>
      </div>
      
      <div
  className={`p-4 rounded-lg border ${
    isDarkMode ? "border-gray-600" : "border-gray-300"
  }`}
>
  <GitHubCalendar
    username="djsmk123"
    blockSize={14}
    blockMargin={5}
    blockRadius={12}
    colorScheme={isDarkMode ? "dark" : "light"}
    hideTotalCount={true}
  />
  </div>
    </Section>
  )
}