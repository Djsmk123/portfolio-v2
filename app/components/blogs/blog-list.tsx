"use client";
import { LargeTitle, SmallTitle } from "../section"
import Link from "next/link"
import { motion } from "framer-motion"
import {  TooltipProvider } from "@/components/ui/tooltip"
import { BlogCard } from "./blog-card";
import { postType } from "@/app/data/mock";
import { useAppData } from "@/lib/app-data-context";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/lib/client-fetch";

export default function BlogComponent({
  fromHome = false
}: {
  fromHome?: boolean
}) {
  const { blogs } = useAppData()
  if (!fromHome) {
    return <BlogListFromRoute />
  }
  if (blogs.length === 0) {
    //fetch
    return (
      //empty state
      <div className="min-h-dvh pt-20 px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-2">
            <LargeTitle>Articles</LargeTitle>
            <SmallTitle>What I&apos;ve been writing</SmallTitle>
          </div>
        </div>
        <BlogList posts={[]} />
      </div>
    )
  }
  return (
    (
      <>
        <div className="space-y-2">
          <LargeTitle>Articles</LargeTitle>
          <SmallTitle>What I&apos;ve been writing</SmallTitle>
          <BlogList posts={blogs.slice(0, 3)} />
        </div>
        <div className="mt-6">
          <Link href="/blogs" className="inline-flex h-10 items-center rounded-md border px-4">Show all articles</Link>
        </div>
      </>
    )
  )
}

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

function BlogListFromRoute() {
  const [posts, setPosts] = useState<postType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetchBlogs()
        console.log("Fetched blogs:", res)
        setPosts(res)
      } catch (err) {
        setError("Failed to load articles. Please try again.")
        console.error("Error loading blogs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadBlogs()
  }, [])

  return (  
    <main className="min-h-dvh px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-2">
          <LargeTitle>Articles</LargeTitle>
          <SmallTitle>What I&apos;ve been writing</SmallTitle>
        </div>
        
        {error && (
          <div className="mt-8 p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="mt-8 text-center py-8">
                <p className="text-sm text-muted-foreground">No articles found</p>
              </div>
            ) : (
              <>
                <div className="mt-4 text-sm text-muted-foreground">
                  Crafted {posts.length} articles
                </div>
                <BlogList posts={posts} />
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}