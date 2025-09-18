import { thoughtOfTheDayType } from "@/app/data/type"
import { withApiMiddlewareWithoutAuth } from "@/lib/api-middleware"
import { NextResponse } from "next/server"


export const GET = withApiMiddlewareWithoutAuth(async () => {
   const thoughtOfTheDay : thoughtOfTheDayType = {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
   }
    return NextResponse.json(thoughtOfTheDay)
})