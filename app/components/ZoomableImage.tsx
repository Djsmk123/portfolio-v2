import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

type ZoomableProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  fillMode?: boolean
  disableDialog?: boolean
}

export default function ZoomableImage({
  src,
  alt,
  className,
  fillMode = false,
  disableDialog = false,
}: ZoomableProps) {
  if (!src) return null

  const imageSrc = typeof src === 'string' ? src : URL.createObjectURL(src)

  if (disableDialog) {
    return fillMode ? (
      <div className={className}>
        <Image src={imageSrc} alt={alt || ''} fill className="object-contain" sizes="100vw" />
      </div>
    ) : (
      <Image
        src={imageSrc}
        alt={alt || ''}
        sizes="100vw"
        className={className}
        style={{ width: '100%', height: 'auto' }}
        width={500}
        height={300}
      />
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {fillMode ? (
          <div className={className}>
            <Image src={imageSrc} alt={alt || ''} fill className="object-contain" sizes="100vw" />
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={alt || ''}
            sizes="100vw"
            className={className}
            style={{ width: '100%', height: 'auto' }}
            width={500}
            height={300}
          />
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-full sm:max-w-7xl border-0 bg-transparent p-0 sm:p-4" showCloseButton={false}>
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
