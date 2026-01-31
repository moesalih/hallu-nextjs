import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ComposeSheet } from '@/lib/components/compose-sheet'
import { ComposeIcon } from '@/lib/components/icons'
import { Button } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'

export function ComposeButton({ channelId, useSheet }: { channelId?: string; useSheet?: boolean }) {
  const router = useRouter()
  const auth = useAuth()
  const [showSheet, setShowSheet] = useState(false)
  const onPress = () => {
    if (useSheet) {
      setShowSheet(true)
    } else {
      router.push(`/compose?${channelId ? `channelId=${channelId}` : ''}`)
    }
  }
  if (!auth?.writeAuthenticated) return null
  return (
    <div>
      <Button className="rounded-full! p-2!" onClick={onPress}>
        <ComposeIcon className="size-4" />
      </Button>
      <ComposeSheet showSheet={showSheet} setShowSheet={setShowSheet} channelId={channelId} />
    </div>
  )
}
