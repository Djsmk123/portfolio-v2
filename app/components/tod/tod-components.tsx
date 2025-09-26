"use client"

import { useSpeachSynthesisApi } from '@/app/hooks/useSpeechSynthesis'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ThoughtCard({
  quote,
  author,
  url
}: {
  quote: string
  author: string
  url: string
}) {
  const words = useMemo(() => quote.split(' '), [quote])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [bars, setBars] = useState<number[]>(() => new Array(20).fill(4))
  const displayed = words.slice(0, currentWordIndex).join(' ')

  const { setText: setTtsText, speak, pause, cancel } = useSpeachSynthesisApi()

  useEffect(() => {
    setIsPlaying(false)
    setCurrentWordIndex(0)
    setBars(new Array(20).fill(4))
    setTtsText(quote)
    cancel()
  }, [quote, setTtsText, cancel])

  useEffect(() => {
    if (!isPlaying || currentWordIndex >= words.length) return
    const id = setInterval(() => {
      setCurrentWordIndex(prev => Math.min(prev + 1, words.length))
    }, 200)
    return () => clearInterval(id)
  }, [isPlaying, currentWordIndex, words.length])

  useEffect(() => {
    const id = setInterval(() => {
      setBars(prev =>
        prev.map(() => (isPlaying ? Math.floor(8 + Math.random() * 20) : 4))
      )
    }, 140)
    return () => clearInterval(id)
  }, [isPlaying])

  return (
    <Link
      href={url}
      className={cn(
        "block rounded-2xl border border-border bg-card p-5",
        "transition-all hover:shadow-md hover:border-primary/30"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={(e) => {
            e.preventDefault()
            if (!isPlaying && currentWordIndex >= words.length) setCurrentWordIndex(0)
            const next = !isPlaying
            setIsPlaying(next)
            if (next) speak()
            else pause()
            if ('vibrate' in navigator) navigator.vibrate(25)
          }}
        />
        <Waveform bars={bars} isPlaying={isPlaying} />
      </div>

      <p className="text-base leading-relaxed text-foreground mb-3">
        {currentWordIndex === 0 && !isPlaying ? quote : displayed}
        {isPlaying && currentWordIndex < words.length && (
          <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse rounded" />
        )}
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <QuoteIcon username={author} />
        {author && (
          <span className="truncate">/u/{author}</span>
        )}
      </div>
    </Link>
  )
}

function PlayPauseButton({
  isPlaying,
  onClick
}: {
  isPlaying: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="flex items-center gap-2 rounded-full px-3"
      onClick={onClick}
    >
      {isPlaying ? "⏸ Pause" : "▶ Play"}
    </Button>
  )
}

function Waveform({ bars, isPlaying }: { bars: number[]; isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-5" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-primary/80 transition-all duration-200"
          style={{ height: `${h}px`, opacity: isPlaying ? 1 : 0.4 }}
        />
      ))}
    </div>
  )
}

function QuoteIcon({ username }: { username?: string }) {
  const letter = username ? username[0].toUpperCase() : '?'

  return (
    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
      {letter}
    </div>
  )
}
