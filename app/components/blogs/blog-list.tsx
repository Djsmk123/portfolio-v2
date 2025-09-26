"use client";
import { motion } from "framer-motion"
import {  TooltipProvider } from "@/components/ui/tooltip"
import { BlogCard } from "./blog-card";
import { postType } from "@/app/data/type";
export function BlogList({
  posts,
}: {
  posts: postType[]
}) {
    const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.1 } },
    };
  
    return (
      <TooltipProvider>
        <motion.ul
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {posts.map((p) => (
            <BlogCard key={p.slug} p={p} />
          ))}
        </motion.ul>
      </TooltipProvider>
    );
  }

