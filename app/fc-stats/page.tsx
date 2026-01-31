'use client'

import { StatsIcon } from '@/lib/components/icons'
import { TitleHeader } from '@/lib/components/misc'
import { supabase } from '@/lib/services/supabase-client'
import { BarChartFromQuery } from '@/lib/utils/chart'

export default function StatsScreen() {
  return (
    <div className="">
      <TitleHeader
        Icon={StatsIcon}
        title="Farcaster Stats"
        shareText={`Check out Farcaster stats on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />
      <FarcasterStats dbKey="dau" title="Daily Active Users" xProp="day" yProp="all_users" />
      <FarcasterStats dbKey="daily_signups" title="Daily New Users" xProp="trunc_date" yProp="fid_registrations" />
    </div>
  )
}

function FarcasterStats({ dbKey, title, xProp, yProp }) {
  return (
    <BarChartFromQuery
      queryKey={['farcaster-stats', dbKey]}
      queryFn={() => fetchFarcasterStats(dbKey)}
      title={title}
      subtitleFunc={undefined}
      xProp={xProp}
      yProp={yProp}
    />
  )
}

async function fetchFarcasterStats(dbKey: string) {
  const { data, error } = await supabase.from('farcaster_stats').select('*').eq('key', dbKey).single()
  if (error) throw error
  const json = JSON.parse(data?.value)
  return json
}
