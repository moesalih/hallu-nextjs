'use client'

import { useUserFromFc, useUserFromParams } from '@/app/u/[username]/layout-client'
import { Debug } from '@/lib/components/ui'

export default function UserDebug() {
  const { data: user } = useUserFromParams()
  if (!user) return null
  const { data: fcAppInfo } = useUserFromFc(user.username)

  return (
    <div className="flex flex-col gap-4 p-4">
      <Debug title="Neynar Data" data={user} />
      <Debug title="Farcaster App Data" data={fcAppInfo} />
    </div>
  )
}
