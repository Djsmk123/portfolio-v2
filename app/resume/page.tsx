import { redirect } from 'next/navigation'


export default async function Page() {
  // ✅ Absolute URL fetch since this runs on the server
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/public/resume`, {
    cache: 'no-store', // disables static cache
  })

  if (!res.ok) {
    // server-side error UI
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load resume.
      </div>
    )
  }

  const data = (await res.json()) 
  const url = data?.resume?.url

  if (url) {
    // ✅ SSR redirect (happens before page renders)
    redirect(url)
  }

  return (
    <div className="p-6 text-sm text-muted-foreground">
      No resume available.
    </div>
  )
}
