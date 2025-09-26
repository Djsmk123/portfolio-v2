import { redirect } from 'next/navigation'
import { headers } from 'next/headers'


export default async function Page () {
  try {
    const hdrs = headers()
    const proto = (await hdrs).get('x-forwarded-proto') || 'https'
    const host = (await hdrs).get('host') || ''
    const originFromHeaders = host ? `${proto}://${host}` : ''
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || originFromHeaders

    const res = await fetch(`${baseUrl}/api/public/resume`, { cache: 'no-store' })
    if (!res.ok) {
      return (
        <div className="p-6 text-sm text-red-500">
          Failed to load resume.
        </div>
      )
    }

    const data = await res.json()
    const url = data?.resume?.url
    if (url) redirect(url)

    return (
      <div className="p-6 text-sm text-muted-foreground">
        No resume available.
      </div>
    )
  } catch (err) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load resume.
      </div>
    )
  }
}
