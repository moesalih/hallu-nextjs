'use client'

import { useChannelFromParams } from '@/app/c/[channelId]/layout-client'
import { BarChartFromQuery } from '@/lib/utils/chart'
import { formatDateShort, formatNumber } from '@/lib/utils/format'
import { fetchChannelCastMetrics } from '@/lib/services/neynar'
import { StatsRows } from '@/lib/components/ui'

export default function ChannelStats() {
  const { data: channel } = useChannelFromParams()
  if (!channel) return null

  const stats = [
    { label: 'Created', value: formatDateShort(channel.created_at) },
    { label: 'Followers', value: formatNumber(channel.follower_count) },
    { label: 'Members', value: formatNumber(channel.member_count) },
    { label: 'Moderators', value: formatNumber(channel.moderator_fids?.length) },
  ]

  return (
    <div>
      <StatsRows stats={stats} />
      <BarChartFromQuery
        queryKey={['channel-cast-stats', channel.id]}
        queryFn={() => fetchChannelCastMetrics({ channelId: channel.id })}
        subtitleFunc={undefined}
        title={`/${channel?.id} Post Activity`}
        xProp={'start'}
        yProp={'cast_count'}
      />
    </div>
  )
}
