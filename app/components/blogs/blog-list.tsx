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
  if (!fromHome) {
    return <BlogListFromRoute />
  }
  const { blogs } = useAppData()
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
    !fromHome ? (
    <BlogListFromRoute />
    ) : (
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
  useEffect(() => {
    const loadBlogs = async () => {
      const res = await fetchBlogs()
      setPosts(res)
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
      <ul className="mt-8 grid gap-4">
        <BlogList posts={posts} />
      </ul>
    </div>
  </main>)
}