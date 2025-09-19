import { motion } from "framer-motion";
import { ExperienceCard } from "./experience-card";
import { experienceType } from "@/app/data/mock";
import { Skeleton } from "@/components/ui/skeleton";

//props
type ExperienceListProps = {
  experience: experienceType[];
  isLoading?: boolean;
}
function ExperienceList({ experience, isLoading = false }: ExperienceListProps) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  if (isLoading) {
    return (
      <div className="mt-10 relative ps-6">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-border" />
        
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative mb-8">
            <div className="absolute left-[-1.5rem] top-6 h-3 w-3 rounded-full bg-border" />
            <div className="ml-4 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (experience.length === 0) {
    return (
      <div className="mt-10 text-center py-8">
        <p className="text-sm text-muted-foreground">No experience found</p>
      </div>
    );
  }

  return (
    <motion.ol
      className="mt-10 relative ps-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* Timeline line */}
      <motion.div
        className="absolute left-3 top-0 bottom-0 w-[2px] bg-border"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      />

      {experience.map((exp) => {
        return <ExperienceCard key={exp.id} exp={exp} />
      })}

    </motion.ol>
  );
}

export default ExperienceList;
