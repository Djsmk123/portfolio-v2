"use client"

import { useSpeachSynthesisApi } from '@/app/hooks/useSpeechSynthesis'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  const [bars, setBars] = useState<number[]>(() => new Array(24).fill(4))
  const displayed = words.slice(0, currentWordIndex).join(' ')

  const { setText: setTtsText, speak, pause, cancel } = useSpeachSynthesisApi()

  useEffect(() => {
    setIsPlaying(false)
    setCurrentWordIndex(0)
    setBars(new Array(24).fill(4))
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
        prev.map(() => {
          if (isPlaying) return Math.floor(6 + Math.random() * 28)
          return Math.max(4, Math.floor(0.7 * (6 + Math.random() * 8)))
        })
      )
    }, isPlaying ? 120 : 300)
    return () => clearInterval(id)
  }, [isPlaying])

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={(e) => {
            e.preventDefault() // stop link navigation when clicking play/pause
            if (!isPlaying && currentWordIndex >= words.length) setCurrentWordIndex(0)
            const next = !isPlaying
            setIsPlaying(next)
            if (next) speak()
            else pause()
            if ('vibrate' in navigator) navigator.vibrate(30)
          }}
        />
        <Waveform bars={bars} isPlaying={isPlaying} />
      </div>

      <div className="flex items-start gap-4">
        <QuoteIcon username={author} />
        <div className="space-y-2">
          <p className="text-base leading-relaxed text-foreground">
            {currentWordIndex === 0 && !isPlaying ? quote : displayed}
            {isPlaying && currentWordIndex < words.length && (
              <span className="inline-block w-2 h-4 bg-orange-500 ml-1 animate-pulse" />
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            {author && (
              <span className="text-gray-500">/u/{author}</span>
            )}
          </div>
        </div>
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
      variant="outline"
      className="flex items-center gap-2 px-4"
      onClick={onClick}
    >
      {isPlaying ? (
        <>
          <span>⏸</span> Pause
        </>
      ) : (
        <>
          <span>▶</span> Play
        </>
      )}
    </Button>
  )
}

function Waveform({ bars, isPlaying }: { bars: number[]; isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-6" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-orange-500 transition-[height,opacity] duration-200"
          style={{ height: `${h}px`, opacity: isPlaying ? 1 : 0.5 }}
        />
      ))}
    </div>
  )
}

function QuoteIcon({
  username
}: {
  username?: string
}) {
  const letter = username ? username[0].toUpperCase() : '?'
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg">
        {letter}
      </div>
      <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping" />
    </div>
  )
}
