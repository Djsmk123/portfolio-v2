import { useSpeachSynthesisApi } from '@/app/hooks/useSpeechSynthesis'
import { useEffect, useMemo, useState } from 'react'

export function ThoughtCard({ quote, author }: { quote: string, author: string }) {
  const words = useMemo(() => quote.split(' '), [quote])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [bars, setBars] = useState<number[]>(() => new Array(24).fill(4))

  const displayed = words.slice(0, currentWordIndex).join(' ')

  const { setText: setTtsText, speak, pause, cancel } = useSpeachSynthesisApi()

  // Reset when quote changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentWordIndex(0)
    setBars(new Array(24).fill(4))
    setTtsText(quote)
    cancel()
  }, [quote, setTtsText, cancel])

  // Word-by-word playback
  useEffect(() => {
    if (!isPlaying || currentWordIndex >= words.length) return
    const id = setInterval(() => {
      setCurrentWordIndex(prev => Math.min(prev + 1, words.length))
    }, 200)
    return () => clearInterval(id)
  }, [isPlaying, currentWordIndex, words.length])

  // Reactive waveform
  useEffect(() => {
    const id = setInterval(() => {
      setBars(prev =>
        prev.map(() => {
          if (isPlaying) {
            return Math.floor(6 + Math.random() * 28)
          }
          return Math.max(4, Math.floor(0.7 * (6 + Math.random() * 8)))
        })
      )
    }, isPlaying ? 120 : 300)
    return () => clearInterval(id)
  }, [isPlaying])

  return (
    <div className='group rounded-2xl border bg-background/50 backdrop-blur p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/40'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={() => {
            if (!isPlaying && currentWordIndex >= words.length) {
              setCurrentWordIndex(0)
            }
            const next = !isPlaying
            setIsPlaying(next)
            if (next) {
              speak()
            } else {
              pause()
            }
            if ('vibrate' in navigator) {
              navigator.vibrate(30)
            }
          }}
        />

        <Waveform bars={bars} isPlaying={isPlaying} />
      </div>

      <div className='flex items-start gap-4'>
        <QuoteIcon />
        <div className='space-y-2'>
          <p className='text-lg md:text-xl leading-relaxed'>
            {currentWordIndex === 0 && !isPlaying ? quote : displayed}
            {isPlaying && currentWordIndex < words.length && (
              <span className='inline-block w-2 h-4 bg-primary/60 ml-1 animate-pulse' />
            )}
          </p>
          <p className='text-muted-foreground'>{author}</p>
        </div>
      </div>
    </div>
  )
}

function PlayPauseButton({
  isPlaying,
  onClick
}: {
  isPlaying: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='h-9 px-4 rounded-md border bg-background/80 hover:bg-background transition-colors flex items-center gap-2 text-sm font-medium'
    >
      {isPlaying ? (
        <>
          <span className='text-lg'>⏸</span> Pause
        </>
      ) : (
        <>
          <span className='text-lg'>▶</span> Play
        </>
      )}
    </button>
  )
}

function Waveform({ bars, isPlaying }: { bars: number[], isPlaying: boolean }) {
  return (
    <div className='flex items-end gap-[3px] h-8' aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className='w-[3px] rounded-full bg-primary/70 transition-[height,opacity] duration-200'
          style={{ height: `${h}px`, opacity: isPlaying ? 1 : 0.6 }}
        />
      ))}
    </div>
  )
}

function QuoteIcon() {
  return (
    <div className='relative'>
      <div className='size-10 md:size-12 rounded-full bg-primary/10 grid place-items-center text-primary'>
        <span className='text-2xl md:text-3xl group-hover:rotate-6'>“</span>
      </div>
      <div className='absolute inset-0 animate-ping rounded-full bg-primary/10' />
    </div>
  )
}

