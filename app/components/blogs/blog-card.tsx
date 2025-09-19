import { postType } from '@/app/data/mock'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Award, CalendarIcon, Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function BlogCard ({ p }: { p: postType }) {
  const pathname = usePathname()
  const isBlogPath = pathname === '/blogs'
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.li key={p.slug} variants={item}>
      <Link href={p.link} target='_blank' rel='noopener noreferrer'>
        <Card
          className={`group h-full overflow-hidden border bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${p.featuredOnGoogleDevLibrary ? 'border-primary/60 shadow-primary/20' : ''
            }`}
        >
          <CardHeader>
            {isBlogPath && p.image && (
              <div className='aspect-[16/9] 39w-full overflow-hidden rounded-t-lg bg-muted h-full'>
                <Image
                  src={p.image}
                  alt={p.title}
                  className='w-full h-full object-cover'
                  loading='lazy'
                  width={640}
                  height={400}
                />
              </div>
            )}
            <div className='flex items-start justify-between gap-2'>
              <h3 className='text-lg font-semibold leading-snug group-hover:text-primary transition-colors'>
                {p.title}
              </h3>
              {p.featuredOnGoogleDevLibrary && (
                <Badge className='bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'>
                  <Award className='h-3 w-3 mr-1' />
                  Google Dev
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className='line-clamp-3 text-sm text-muted-foreground'>
              {p.description}
            </p>
            <div className='mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4' />
                <time>
                  {new Date(p.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              {p.likes && (
                <div className='flex items-center gap-1 text-red-500'>
                  <Heart className='h-3 w-3 fill-current' />
                  <span className='font-medium'>{p.likes.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              {p.tags.map(tag => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='rounded-full px-2 py-0.5 text-xs hover:bg-primary/10 transition'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.li>
  )
}