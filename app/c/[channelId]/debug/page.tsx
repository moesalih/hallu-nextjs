'use client'

import { useChannelFromParams } from '@/app/c/[channelId]/layout-client'
import { Debug } from '@/lib/components/ui'

export default function ChannelDebug() {
  const { data: channel } = useChannelFromParams()
  if (!channel) return null
  return <Debug title="Neynar Data" className="p-4" data={channel} />
}
