import { motion } from "framer-motion";
import { ExperienceCard } from "./experience-card";
import { experienceType } from "@/app/data/mock";


//props
type ExperienceListProps = {
  experience: experienceType[];
}
function ExperienceList({ experience }: ExperienceListProps) {
    const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.12 } },
    };
  
  
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
