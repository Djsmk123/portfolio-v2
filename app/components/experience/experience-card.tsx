import { ExperienceType, experienceType } from "@/app/data/type";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";
// Color map for type
const typeStyles: Record<ExperienceType, { badge: string; dot: string }> = {
    [ExperienceType["FullTime"]]: {
      badge: "bg-green-500/10 text-green-700 dark:text-green-300",
      dot: "bg-green-500",
    },
    [ExperienceType["Internship"]]: {
      badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500",
    },
    [ExperienceType["Contract"]]: {
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
  };
export function ExperienceCard({ exp }: { exp: experienceType }) {
    const styles = typeStyles[exp.type];
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      };
    return (
      <motion.li key={exp.id} className="relative mb-10 ms-4" variants={{item}}>
        {/* Timeline dot based on type */}
        <span className="absolute -left-[27px] top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ring-4 ring-background transition-all duration-300">
          <span
            className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
          />
        </span>

        {/* Card */}
        <Card className="group relative overflow-hidden border bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">
                {exp.title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{exp.company}</span>
              </div>
            </div>
            {/* Type badge */}
            <Badge
              className={`mt-2 w-fit rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}
            >
              {exp.type}
            </Badge>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Meta */}
            <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time>{exp.date}</time>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{exp.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {exp.description}
            </p>
          </CardContent>
        </Card>
      </motion.li>
    );
}