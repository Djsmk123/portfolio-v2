import { headers } from 'next/headers'
import { ErrorState, NoResumeState } from './stats'
import { ExternalRedirect } from './redirect'
import { publicConfig } from '@/lib/config'



export default async function Page() {
  try {
    const hdrs = headers()
    const proto = (await hdrs).get('x-forwarded-proto') || 'https'
    const host = (await hdrs).get('host') || ''
    const originFromHeaders = host ? `${proto}://${host}` : ''
    const appUrl = publicConfig.appUrl || originFromHeaders
    let res
    try {
      res = await fetch(`${appUrl}/api/public/resume`, { cache: 'no-store' })
    } catch (fetchErr) {
      //cache if error is
      let errorMessage = 'Network error. Please try again later.'
      if (fetchErr instanceof Error) {
        errorMessage = fetchErr.message
      }
      
      return (
        <ErrorState
          status={0}
          statusText={errorMessage}
          message="Network error. Please try again later."
        />
      )
    }

    if (!res.ok) {
      let errorMessage = ''
      try {
        const errorData = await res.json()
        errorMessage = errorData?.error || ''
      } catch (jsonErr) {
        errorMessage = res.statusText || 'Unknown error'
        if (jsonErr instanceof Error) {
          errorMessage = jsonErr.message
        }
        return (
          <ErrorState
            status={0}
            statusText={errorMessage}
            message={errorMessage}
          />
        )

      }
    }else{
      return (
        <ErrorState
          status={res.status}
          statusText={res.statusText}
          message= "Invalid server response."
        />
      )
    }

    let data
    try {
      data = await res.json()
    } catch (jsonErr) {
      let errorMessage = 'Invalid server response.'
      if (jsonErr instanceof Error) {
        errorMessage = jsonErr.message
      }
      return (
        <ErrorState
          status={0}
          statusText={errorMessage}
          message="Invalid server response."
        />
      )
    }

    try{
      const url = data?.resume?.url
      if (url) {
        return <ExternalRedirect url={url} />
      }
    } catch (redirectErr) {
      let errorMessage = 'Invalid redirect URL.'
      if (redirectErr instanceof Error) {
        errorMessage = redirectErr.message
      }
      return (
        <ErrorState
          status={0}
          statusText=""
          message={errorMessage}
        />
      )
    }

    return <NoResumeState />
  } catch (err) {
    let message = 'An unexpected error occurred.'
    if (err instanceof Error) message = err.message
    return <ErrorState status={0} statusText="" message={message} />
  }
}
