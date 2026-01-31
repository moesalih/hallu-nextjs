'use client'

import { useRouter } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import { ChannelIcon } from '@/lib/components/icons'
import { ProfileCard, TabsWithContent, TitleHeader } from '@/lib/components/misc'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchTrendingChannels, fetchUserChannels } from '@/lib/services/neynar'

export default function ChannelsScreen() {
  return (
    <div>
      <TitleHeader
        Icon={ChannelIcon}
        title="Channels"
        shareText={`Check out channels on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />
      <ExploreChannels />
    </div>
  )
}

function ExploreChannels() {
  const auth = useAuth()

  const tabs = [
    auth?.readAuthenticated && {
      name: 'Following',
      content: (
        <ChannelsGridFeed
          queryKey={['following-channels', auth?.userFid]}
          queryFn={({ pageParam }) => fetchUserChannels({ fid: auth?.userFid || 3, cursor: pageParam })}
        />
      ),
    },
    {
      name: 'Trending',
      content: (
        <ChannelsGridFeed
          queryKey={['trending-channels']}
          queryFn={({ pageParam }) => fetchTrendingChannels({ cursor: pageParam })}
        />
      ),
    },
  ].filter(Boolean) as { name: string; content: React.ReactNode }[]

  return <TabsWithContent tabs={tabs} initialTab={tabs[0].name} />
}

export function ChannelsGridFeed({ queryKey, queryFn }) {
  return (
    <Feed
      queryKey={queryKey}
      queryFn={queryFn}
      renderItem={(item) => <ChannelCard key={item.id} channel={item} />}
      containerClass="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4"
    />
  )
}

function ChannelCard({ channel }) {
  const router = useRouter()
  return <ProfileCard image={channel.image_url} name={channel.id} onClick={() => router.push(`/c/${channel.id}`)} />
}
