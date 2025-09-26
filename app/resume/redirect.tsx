"use client"
import { useEffect } from "react"

export function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    if (url) window.location.href = url
  }, [url])

  return <p>Redirecting to your resume...</p>
}