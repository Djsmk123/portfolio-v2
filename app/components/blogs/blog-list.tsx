"use client";
import { posts } from "@/app/data/mock"
import { LargeTitle, SmallTitle } from "../section"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { CalendarIcon, StarIcon, Heart, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BlogComponent({
  fromHome = false
}: {
  fromHome?: boolean
}) {
  return (
    !fromHome ? (
      <main className="min-h-dvh px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-2">
            <LargeTitle>Articles</LargeTitle>
            <SmallTitle>What I've been writing</SmallTitle>
          </div>
          <ul className="mt-8 grid gap-4">
            <BlogList/>
          </ul>
        </div>
      </main>
    ) : (
      <>
        <div className="space-y-2">
          <LargeTitle>Articles</LargeTitle>
          <SmallTitle>What I've been writing</SmallTitle>
          <BlogList limit={3} />
        </div>
        <div className="mt-6">
          <Link href="/blogs" className="inline-flex h-10 items-center rounded-md border px-4">Show all articles</Link>
        </div>
      </>
    )
  )
}

export function BlogList({ limit }: { limit?: number }) {
    const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.1 } },
    };
    const item = {
      hidden: { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
          {posts.slice(0, limit ?? posts.length).map((p) => (
            <motion.li key={p.slug} variants={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={p.link} target="_blank" rel="noopener noreferrer">
                    <Card
                      className={`group h-full overflow-hidden border bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        p.featuredArticle ? "border-primary/60 shadow-primary/20" : ""
                      }`}
                    >
                      

                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                            {p.title}
                          </h3>
                          {p.featuredOnGoogleDevLibrary && (
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              <Award className="h-3 w-3 mr-1" />
                              Google Dev
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {p.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <time>
                              {new Date(p.date).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                          {p.likes && (
                            <div className="flex items-center gap-1 text-red-500">
                              <Heart className="h-3 w-3 fill-current" />
                              <span className="font-medium">{p.likes.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full px-2 py-0.5 text-xs hover:bg-primary/10 transition"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to read "{p.title}"</p>
                </TooltipContent>
              </Tooltip>
            </motion.li>
          ))}
        </motion.ul>
      </TooltipProvider>
    );
  }