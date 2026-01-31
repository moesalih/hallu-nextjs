'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { ComposeButton } from '@/lib/components/compose-button'
import { Feed } from '@/lib/components/feed'
import { usePinFeedMenuOption } from '@/lib/components/feeds-pinned'
import { DebugIcon, MediaIcon, PostsIcon, TrophyIcon } from '@/lib/components/icons'
import { NavOutlet, ProfileHeader } from '@/lib/components/misc'
import { InteractionButton } from '@/lib/components/other-interactions'
import { PaddedError, PaddedSpinner } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchChannel, fetchChannelFeed } from '@/lib/services/neynar'
import { useFetchNeynarWithAuth } from '@/lib/utils/farcaster'

export default function ChannelScreen({ children }: { children: React.ReactNode }) {
  const { data: channel, isLoading } = useChannelFromParams()

  if (isLoading) return <PaddedSpinner />
  if (!channel) return <PaddedError message="Channel not found" />

  return (
    <div>
      <ChannelHeader channel={channel} />
      <ChannelNav />
      {children}
    </div>
  )
}

function ChannelHeader({ channel }) {
  const pinFeedMenuOption = usePinFeedMenuOption()
  return (
    <ProfileHeader
      image={channel?.image_url}
      name={`${channel?.id}`}
      description={channel?.description}
      stat={{ label: 'Followers', value: channel?.follower_count }}
      shareText={`Check out /${channel?.id} on Sonar!\n\n\n✴︎ mini app by @moe`}
      primaryActions={
        <div className="flex flex-row gap-2">
          <ChannelFollowButton channel={channel} />
          <ChannelComposeButton channel={channel} />
        </div>
      }
      menuOptions={[pinFeedMenuOption]}
    />
  )
}

function ChannelComposeButton({ channel }) {
  if (!channel) return null
  if (!(channel?.public_casting || !!channel?.viewer_context?.role)) return null
  return <ComposeButton channelId={channel.id} />
}

function ChannelFollowButton({ channel }) {
  const auth = useAuth()
  const fetchNeynarWithAuth = useFetchNeynarWithAuth()

  if (!auth?.writeAuthenticated) return null

  return (
    <InteractionButton
      active={channel?.viewer_context?.following}
      activeText="Following"
      inactiveText="Follow"
      onPress={(isActive) =>
        fetchNeynarWithAuth('channel/follow', isActive ? 'DELETE' : 'POST', { channel_id: channel?.id })
      }
    />
  )
}

function ChannelNav() {
  const { channelId } = useParams()
  const navLinks = [
    { Icon: PostsIcon, name: 'Posts', path: `/c/${channelId}` },
    { Icon: MediaIcon, name: 'Media', path: `/c/${channelId}/media` },
    { Icon: TrophyIcon, name: 'Stats', path: `/c/${channelId}/stats` },
    { Icon: DebugIcon, name: 'Debug', path: `/c/${channelId}/debug` },
  ]
  return <NavOutlet navLinks={navLinks} />
}

export function ChannelFeed({ channelId, display }: { channelId: string; display?: string }) {
  const auth = useAuth()
  return (
    <Feed
      queryKey={['channel-feed', channelId, auth?.userFid]}
      queryFn={({ pageParam }) =>
        fetchChannelFeed({ channelId: channelId, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })
      }
      display={display}
    />
  )
}

export function useChannelFromParams() {
  const auth = useAuth()
  const { channelId } = useParams()
  return useQuery({
    queryKey: ['channel', channelId, auth?.userFid],
    queryFn: () => fetchChannel({ channelId: channelId as string, viewer_fid: auth?.userFid?.toString() }),
    staleTime: 1000 * 60 * 5,
  })
}
