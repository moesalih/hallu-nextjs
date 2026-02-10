'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import { usePinFeedMenuOption } from '@/lib/components/feeds-pinned'
import { DebugIcon, MediaIcon, PostsIcon, TrophyIcon } from '@/lib/components/icons'
import { NavOutlet, ProfileHeader, userDefaultImage } from '@/lib/components/misc'
import { InteractionButton } from '@/lib/components/other-interactions'
import { PaddedError, PaddedSpinner } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchUser } from '@/lib/services/neynar'
import { fetchUserByUsername, fetchUserPosts } from '@/lib/services/hallu'
import { useFetchNeynarWithAuth } from '@/lib/utils/farcaster'
import { fetchProxyJSON } from '@/lib/utils/fetch'

export default function UserScreen({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUserFromParams()

  if (isLoading) return <PaddedSpinner />
  if (!user) return <PaddedError message="User not found" />

  return (
    <div>
      <UserHeader user={user} />
      <UserNav />
      {children}
    </div>
  )
}

function UserHeader({ user }) {
  const pinFeedMenuOption = usePinFeedMenuOption()
  return (
    <ProfileHeader
      image={userDefaultImage(user?.username)}
      name={`${user?.username}`}
      description={user?.profile?.bio?.text}
      stat={{ label: 'Followers', value: user?.follower_count }}
      shareText={`Check out @${user?.username} on Sonar!\n\n\n✴︎ mini app by @moe`}
      primaryActions={<UserFollowButton user={user} />}
      menuOptions={[pinFeedMenuOption]}
    />
  )
}

function UserFollowButton({ user }) {
  const auth = useAuth()
  const fetchNeynarWithAuth = useFetchNeynarWithAuth()

  if (!auth?.writeAuthenticated) return null
  if (auth?.userFid == user?.fid) return null

  return (
    <InteractionButton
      active={user?.viewer_context?.following}
      activeText="Following"
      inactiveText="Follow"
      onPress={(isActive) =>
        fetchNeynarWithAuth('user/follow', isActive ? 'DELETE' : 'POST', {
          target_fids: [user?.fid],
        })
      }
    />
  )
}

function UserNav() {
  const { username } = useParams()
  const decodedUsername = decodeURIComponent(username as string)

  const navLinks = [
    { Icon: PostsIcon, name: 'Posts', path: `/u/${decodedUsername}` },
    { Icon: MediaIcon, name: 'Media', path: `/u/${decodedUsername}/media` },
    { Icon: TrophyIcon, name: 'Stats', path: `/u/${decodedUsername}/stats` },
    { Icon: DebugIcon, name: 'Debug', path: `/u/${decodedUsername}/debug` },
  ]
  return <NavOutlet navLinks={navLinks} />
}

export function useUserFromParams() {
  const { username } = useParams()
  const decodedUsername = decodeURIComponent(username as string)
  return useUser(decodedUsername)
}

export function useUser(username: string) {
  const auth = useAuth()
  return useQuery({
    queryKey: ['user', username, auth?.userFid],
    queryFn: () => fetchUserByUsername(username),
    staleTime: 1000 * 60 * 5,
  })
}

export function UserFeed({ username, display }: { username: string; display?: string }) {
  const auth = useAuth()
  const { data: user } = useUser(username)
  console.log('UserFeed user:', user)
  if (!user) return null
  return (
    <Feed
      queryKey={['user-feed', user?.username, auth?.userFid]}
      queryFn={({ pageParam }) => fetchUserPosts(username)}
      display={display}
    />
  )
}

//////////

export async function fetchUserFromFc(username: string) {
  const response = await fetchProxyJSON(`https://client.farcaster.xyz/v2/user-by-username?username=${username}`)
  return response?.result
}
export function useUserFromFc(username: string) {
  return useQuery({
    queryKey: ['user-fc', username],
    queryFn: () => fetchUserFromFc(username),
    staleTime: 1000 * 60 * 5,
  })
}
