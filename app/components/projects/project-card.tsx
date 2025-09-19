import { projectType } from "@/app/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLinkIcon, GithubIcon, ZoomInIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import ProjectBanner from "./project-banner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ProjectCard = memo(function ProjectCard({ p }: { p: projectType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const onCardClickCapture: React.MouseEventHandler = (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("a,button,[role='button'],input,textarea,select")) return;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
    className={`group relative overflow-hidden border bg-background/60 backdrop-blur-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1 pt-0 
        ${p.org ? "hover:border-primary/60" : "hover:border-muted/40"}`}
      onClickCapture={onCardClickCapture}
      role="button"
      tabIndex={0}
      aria-label={`Open ${p.name} gallery`}
    >
      {/* Banner */}
      <div className="relative" onClick={() => { if (p.images?.length) { setCurrentImageIndex(0); setShowGallery(true) } }}>
        <ProjectBanner images={p.images} name={p.name} />

        {/* Zoom hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-md backdrop-blur-sm">
            <ZoomInIcon className="h-4 w-4" />
            View Gallery
          </div>
        </div>
      </div>

      {/* Lightbox Gallery */}
      {p.images?.length ? (
        <Dialog open={showGallery} onOpenChange={setShowGallery}>
          <DialogContent 
            className="w-full max-w-5xl border-0 bg-background/95 p-0 sm:p-3"
            showCloseButton={false}
            // Responsive height for dialog content
            style={{
              height: "80vh",
              maxHeight: "90vh",
            }}
          >
            <DialogTitle className="sr-only">{p.name} gallery</DialogTitle>
            <div
              className="
                relative w-full
                aspect-video
                bg-black/60 rounded-md overflow-hidden
                sm:aspect-video
                h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]
                max-h-[90vh]
              "
              style={{
                height: "50vh",
                maxHeight: "90vh",
              }}
            >
              <Image
                src={p.images[currentImageIndex]}
                alt={`${p.name} image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {p.images.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                    onClick={() => setCurrentImageIndex((i) => (i - 1 + p.images.length) % p.images.length)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                    onClick={() => setCurrentImageIndex((i) => (i + 1) % p.images.length)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/80">
                    {currentImageIndex + 1} / {p.images.length}
                  </div>
                </>
              )}
              <button
                aria-label="Close gallery"
                className="absolute right-2 top-2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                onClick={() => setShowGallery(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      {/* Header */}
      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        {p.org && p.org.name && p.org.logo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image
              src={p.org.logo}
              alt={p.org.name}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-border"
              width={20}
              height={20}
              loading="lazy"
            />
            <Link
              href={p.org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {p.org.name}
            </Link>
          </div>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="mb-4">
          <p className={`text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {p.desc}
          </p>
          {p.desc.length > 100 && (
            <button
              onClick={toggleExpanded}
              className="mt-2 text-xs text-primary hover:underline focus:outline-none focus:underline"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="rounded-full transition-transform hover:scale-105 hover:bg-primary/10"
            >
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>

      {(p.github || p.links?.website || p.links?.playstore || p.links?.appstore) && (
        <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
          {p.links?.website && (
            <Button asChild size="sm" className="transition hover:scale-105">
              <Link
                href={p.links.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} website`}
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Live
              </Link>
            </Button>
          )}

          {p.github && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="transition hover:scale-105"
            >
              <Link
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} GitHub`}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                Code
              </Link>
            </Button>
          )}

          {p.links?.playstore && (
            <Button asChild size="sm" className="transition hover:scale-105">
              <Link
                href={p.links.playstore}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} Playstore`}
              >
                <Image
                  src="/assets/google-play.png"
                  alt="Playstore"
                  className="mr-2 h-4 w-4"
                  width={16}
                  height={16}
                  loading="lazy"
                />
                Playstore
              </Link>
            </Button>
          )}

          {p.links?.appstore && (
            <Button asChild size="sm" className="transition hover:scale-105">
              <Link
                href={p.links.appstore}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} Appstore`}
              >
                <Image
                  src="/assets/appstore.png"
                  alt="Appstore"
                  className="mr-2 h-4 w-4"
                  width={16}
                  height={16}
                  loading="lazy"
                />
                Appstore
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
      
    </Card>
  );
});

export default ProjectCard;
