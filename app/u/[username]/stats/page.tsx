'use client'

import { useQuery } from '@tanstack/react-query'

import { useUserFromFc, useUserFromParams } from '@/app/u/[username]/layout-client'
import { QuotedPost } from '@/lib/components/post'
import { fetchFirstCast, fetchUserCastMetrics } from '@/lib/services/neynar'
import { BarChartFromQuery } from '@/lib/utils/chart'
import { capitalize, formatDateShort, formatNumberFull } from '@/lib/utils/format'
import { Separator, StatsRows } from '@/lib/components/ui'

export default function UserStats() {
  const { data: user } = useUserFromParams()
  if (!user) return null

  const { data: fcAppInfo } = useUserFromFc(user.username)

  const stats = [
    { label: 'FID', value: user.fid },
    {
      label: 'Followers',
      value:
        (fcAppInfo ? `Farcaster: ${formatNumberFull(fcAppInfo?.user?.followerCount)}\n` : ``) +
        `Neynar: ${formatNumberFull(user.follower_count)}`,
    },
    {
      label: 'Following',
      value:
        (fcAppInfo ? `Farcaster: ${formatNumberFull(fcAppInfo?.user?.followingCount)}\n` : ``) +
        `Neynar: ${formatNumberFull(user.following_count)}`,
    },
    user.pro?.status && {
      label: 'Farcaster Pro',
      value:
        capitalize(user.pro?.status) +
        '\nSubscribed On: ' +
        formatDateShort(user.pro?.subscribed_at) +
        '\nExpires On: ' +
        formatDateShort(user.pro?.expires_at),
    },
    fcAppInfo?.extras?.publicSpamLabel && { label: 'Farcaster Spam Label', value: fcAppInfo?.extras?.publicSpamLabel },
    { label: 'Neynar Score', value: user.score },

    fcAppInfo?.user?.profile?.profileToken?.token?.symbol && {
      label: 'Profile Token',
      value: '$' + fcAppInfo?.user?.profile?.profileToken?.token?.symbol,
    },
  ].filter(Boolean)

  return (
    <div>
      <StatsRows stats={stats} />
      <BarChartFromQuery
        queryKey={['user-cast-stats', user.fid]}
        queryFn={() => fetchUserCastMetrics({ fid: user.fid })}
        title={`@${user.username} Post Activity`}
        subtitleFunc={(data) =>
          `Posts (6M): ${totalFromPostActivity(data)}\nStreak: ${streakFromPostActivity(data)} days`
        }
        xProp={'start'}
        yProp={'cast_count'}
      />
      <Separator className="opacity-50" />
      <FirstPost fid={user.fid} />
    </div>
  )
}

function totalFromPostActivity(data) {
  return data.reduce((a, b) => a + b.cast_count, 0)
}
function streakFromPostActivity(data) {
  // calculate current streak by counting consecutive non-zero days from the start of the array
  let currentStreak = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i].cast_count > 0) {
      currentStreak++
    } else {
      break
    }
  }
  if (currentStreak >= 180) return '180+'
  return currentStreak
}

function FirstPost({ fid }) {
  const { data: firstPost, isLoading } = useQuery({
    queryKey: ['first-post', fid],
    queryFn: () => fetchFirstCast({ fid }),
    staleTime: 5 * 60 * 1000,
  })

  if (!firstPost) return null

  return (
    <div className="p-4">
      <div className="flex flex-row items-start justify-between gap-4  mb-4">
        <div className="font-medium">First Post</div>
        {true && (
          <div className="whitespace-pre-wrap text-right text-sm opacity-50">
            {formatDateShort(firstPost?.timestamp)}
          </div>
        )}
      </div>
      <QuotedPost cast={firstPost} />
    </div>
  )
}
