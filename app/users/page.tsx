'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import { UsersIcon } from '@/lib/components/icons'
import { ProfileCard, TitleHeader } from '@/lib/components/misc'
import { PaddedError, PaddedSpinner } from '@/lib/components/ui'
import { fetchTrendingUsers } from '@/lib/services/farcaster'

export default function UsersScreen() {
  return (
    <div>
      <TitleHeader
        Icon={UsersIcon}
        title="Users"
        shareText={`Check out trending users on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />
      <TrendingUsersGrid />
    </div>
  )
}

function TrendingUsersGrid() {
  const router = useRouter()
  const { data: trendingUsers, isLoading } = useQuery({
    queryKey: ['trending-users'],
    queryFn: () => fetchTrendingUsers(),
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return <PaddedSpinner />
  if (!trendingUsers) return <PaddedError message="Users not found" />

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {trendingUsers?.map((user) => (
        <UserCard key={user?.username} user={user} />
      ))}
    </div>
  )
}

function UserCard({ user }) {
  const router = useRouter()
  return <ProfileCard image={user?.pfp_url} name={user?.username} onClick={() => router.push(`/u/${user?.username}`)} />
}

export function UsersGridFeed({ queryKey, queryFn }) {
  return (
    <Feed
      queryKey={queryKey}
      queryFn={queryFn}
      renderItem={(item) => <UserCard key={item.username} user={item} />}
      containerClass="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4"
    />
  )
}
