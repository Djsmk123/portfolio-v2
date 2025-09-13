import { projectType } from "@/app/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLinkIcon, GithubIcon, ZoomInIcon } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import ProjectBanner from "./project-banner";

const ProjectCard = memo(function ProjectCard({ p }: { p: projectType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      <div className="relative">
        <ProjectBanner images={p.images} name={p.name} />

        {/* Zoom hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-md backdrop-blur-sm">
            <ZoomInIcon className="h-4 w-4" />
            View Gallery
          </div>
        </div>
      </div>

      {/* Header */}
      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        {p.org && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img
              src={p.org.logo}
              alt={p.org.name}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-border"
              width={20}
              height={20}
              loading="lazy"
              decoding="async"
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
                <img
                  src="/assets/google-play.png"
                  alt="Playstore"
                  className="mr-2 h-4 w-4"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
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
                <img
                  src="/assets/appstore.png"
                  alt="Appstore"
                  className="mr-2 h-4 w-4"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
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
