import { NextResponse } from "next/server"
import { profileStatsType } from "@/app/data/type"
import { withApiMiddlewareWithoutAuth } from "@/lib/api-middleware"
// Next.js API handler
export const GET = withApiMiddlewareWithoutAuth(async () => {
  try {
    const data: profileStatsType[] = [
      {
        label: "Experience",
        value: "1.5+",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Years of experience",
      },
      {
        label: "Projects",
        value: "100+",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        description: "Projects",
      },
      {
        label: "Articles",
        value: "0",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        description: "Articles",
      },
      {
        label: "Commits",
        value: "1000+",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        description: "Commits",
      },
      {
        label: "Views",
        value: "10",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        description: "Views",
      },
      //Terminal line of code
      {
        label: "LOC",
        value: "5M+",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        description: "Lines of code",
      },
      //Github stars
      {
        //total clients
        label: "Clients",
        value: "12+",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Clients",
      },
    ]

    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
})

export const OPTIONS = withApiMiddlewareWithoutAuth(async () => {
  return new NextResponse(null, { status: 204 })
})

