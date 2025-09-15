import React, { useState } from 'react'
import Image from 'next/image'
import { Edit, Trash, ExternalLink, Images, Copy, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { projectType } from '@/app/data/mock'

export function AdminProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: projectType
  onEdit: (p: projectType) => void
  onDelete: (id: string) => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const { 
    id, 
    name, 
    desc, 
    tags, 
    images, 
    links = {
      playstore: '',
      appstore: '',
      website: '',
    }, 
    github, 
    org, 
    createdAt, 
    updatedAt, 
    isActive 
  } = project

  const prettyDate = (t?: number | string | Date) => {
    if (!t) return '-'
    const d = t instanceof Date ? t : new Date(t)
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d)
  }

  const active = isActive !== false
  const imagesArray = Array.isArray(images) ? images : []
  const imagesCount = imagesArray.length

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch (error) {
      // Handle clipboard error silently
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesCount)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount)
  }

  const ImageCarousel = ({ images }: { images: string[] }) => {
    if (!images.length) return null

    return (
      <div className="relative group">
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
          <Image
            src={images[currentImageIndex]}
            alt={`${name} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {currentImageIndex + 1} / {imagesCount}
          </div>

          {/* Navigation Buttons */}
          {imagesCount > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* View All Images Button */}
          {imagesCount > 1 && (
            <button
              onClick={() => setShowImageDialog(true)}
              className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/80 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-3 w-3" />
              View All ({imagesCount})
            </button>
          )}
        </div>

        {/* Image Dots Indicator */}
        {imagesCount > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
            {imagesCount > 5 && (
              <span className="text-xs text-muted-foreground ml-1">+{imagesCount - 5}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Organization Avatar */}
              {org?.logo ? (
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={org.logo} alt={org.name || 'org logo'} />
                  <AvatarFallback className="text-sm font-medium">
                    {(org.name || name || 'P').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-medium text-primary border-2 border-background">
                  {(org?.name || name || 'P').slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
                {org?.name && (
                  <p className="text-sm text-muted-foreground truncate">{org.name}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(project)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit project</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete project</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mt-3">
            <Badge 
              variant={active ? "default" : "secondary"}
              className={`${active 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {active ? 'Active' : 'Inactive'}
            </Badge>
            
            <div className="flex items-center gap-2">
              {github && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>View on GitHub</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardDescription className="text-sm leading-relaxed line-clamp-2 cursor-help">
                  {desc || 'No description available'}
                </CardDescription>
              </TooltipTrigger>
              {desc && (
                <TooltipContent className="max-w-sm">
                  <p className="text-xs">{desc}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Images Carousel */}
          {imagesCount > 0 && <ImageCarousel images={imagesArray} />}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                  +{tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Created: {prettyDate(createdAt)}</span>
              <span>Updated: {prettyDate(updatedAt)}</span>
            </div>
            {org?.url && (
              <a 
                href={org.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Organization <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* External Links */}
          <div className="flex items-center gap-2">
            {links.website && (
              <Button size="sm" asChild>
                <a href={links.website} target="_blank" rel="noopener noreferrer">
                  Visit Site
                </a>
              </Button>
            )}
            {links.playstore && (
              <Button size="sm" variant="outline" asChild>
                <a href={links.playstore} target="_blank" rel="noopener noreferrer">
                  Play Store
                </a>
              </Button>
            )}
            {links.appstore && (
              <Button size="sm" variant="outline" asChild>
                <a href={links.appstore} target="_blank" rel="noopener noreferrer">
                  App Store
                </a>
              </Button>
            )}
          </div>

          {/* Copy ID Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyId}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-muted"
                >
                  <span className="font-mono">{id.slice(0, 8)}...</span>
                  {copiedId ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedId ? 'Copied!' : 'Copy full ID'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Project Images - {name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageDialog(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {imagesArray.map((src, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => {
                  setCurrentImageIndex(index)
                  setShowImageDialog(false)
                }}
              >
                <Image
                  src={src}
                  alt={`${name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AdminProjectCard