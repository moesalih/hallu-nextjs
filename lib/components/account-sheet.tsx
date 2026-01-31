import { AccountIcon } from '@/lib/components/icons'
import { Sheet } from '@/lib/components/sheets'
import { Button } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'

export function AccountSheet({
  showSheet,
  setShowSheet,
}: {
  showSheet: boolean
  setShowSheet: (show: boolean) => void
}) {
  const auth = useAuth()
  // console.log('Auth in Account sheet:', auth)

  return (
    <Sheet showSheet={showSheet} setShowSheet={setShowSheet} stopPropagation>
      <div className="flex flex-col items-center gap-6 m-10">
        {!auth?.writeAuthenticated && !auth?.userFid && (
          <div className="flex flex-col items-center gap-6">
            <AccountIcon className="size-16 opacity-50" />
            <div className="text-sm text-center opacity-50">
              Sign in with your Facaster account to interact with posts and users
            </div>
            <Button onClick={() => auth?.login()}>Sign in with Farcaster</Button>
          </div>
        )}

        {auth?.userFid && (
          <div className="flex flex-col items-center gap-4">
            <img className="size-16 rounded-full object-cover" src={auth?.userImage}></img>
            {auth?.username} ({auth?.userFid})
          </div>
        )}

        {auth?.writeAuthenticated && (
          <Button variant="outline" onClick={() => auth?.logout()}>
            Sign out
          </Button>
        )}
      </div>
    </Sheet>
  )
}
