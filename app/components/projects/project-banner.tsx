import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import ZoomableImage from "../ZoomableImage";

export const ProjectBanner = memo(function ProjectBanner({
    images,
    name,
  }: {
    images: string[];
    name: string;
  }) {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      if (!images || images.length <= 1) return;
  
      // randomize each card’s delay & interval
      const initialDelay = Math.random() * 3000 + Math.random()*Math.random()*1000  ; // 0–3s
      const intervalTime = Math.random() * 4000 + 6000 + Math.random()*Math.random()*1000; // 6–10s
  
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setIndex((prev) => (prev + 1) % images.length);
        }, intervalTime);
        return () => clearInterval(interval);
      }, initialDelay);
  
      return () => clearTimeout(timeout);
    }, [images]);
  
    const currentSrc = images[index] ?? "/next.svg";
  
    return (
      <div className="relative aspect-video overflow-hidden">
        {/* Background blurred image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={index + "-bg"}
            src={currentSrc}
            alt={name}
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            loading="lazy"
            decoding="async"
          />
        </AnimatePresence>
  
        {/* Foreground main image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index + "-fg"}
            className="relative z-10 flex h-full w-full items-center justify-center"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
          >
            <ZoomableImage
              src={currentSrc}
              alt={name}
              className="relative h-full w-full"
              fillMode
              disableDialog
              role="img"
            />
          </motion.div>
        </AnimatePresence>
  
        {/* Gradient overlay (non-interactive) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>
    );
  });

export default ProjectBanner;