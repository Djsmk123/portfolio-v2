import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ExclamationTriangleIcon, FileIcon } from '@radix-ui/react-icons'

function ErrorState({
  status,
  statusText,
  message,
}: {
  status: number
  statusText: string
  message: string
}) {
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Alert
        variant="destructive"
        className="my-8 max-w-lg w-full text-center space-y-3"
      >
        <div className="flex flex-col items-center">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-red-500 mb-2"
            aria-hidden="true"
          />
          <AlertTitle>Failed to load resume</AlertTitle>
        </div>
        <AlertDescription>
          <div className="space-y-1">
            {status ? (
              <p className="font-mono text-sm">
                Status: {status} {statusText}
              </p>
            ) : null}
            {message ? (
              <p className="break-words text-sm">{message}</p>
            ) : null}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function NoResumeState() {
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Alert className="my-8 max-w-lg w-full text-center space-y-3">
        <div className="flex flex-col items-center">
          <FileIcon
            className="h-5 w-5 text-muted-foreground mb-2"
            aria-hidden="true"
          />
          <AlertTitle>No resume available</AlertTitle>
        </div>
        <AlertDescription>
          <p>
            The resume could not be found. Please check back later or contact
            the site owner.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export { ErrorState, NoResumeState }