import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

export default function ZoomableImage({
  src,
  alt,
  className,
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  if (!src) return null

  const imageSrc = typeof src === 'string' ? src : URL.createObjectURL(src)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={imageSrc}
          alt={alt || ''}
          sizes="100vw"
          className={className}
          style={{ width: '100%', height: 'auto' }}
          width={500}
          height={300}
        />
      </DialogTrigger>
      <DialogContent className="w-full max-w-full sm:max-w-7xl border-0 bg-transparent p-0 sm:p-4">
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <div className="relative w-full max-h-[90vh] overflow-hidden rounded-md bg-black">
          <Image
            src={imageSrc}
            alt={alt || ''}
            fill
            priority
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
