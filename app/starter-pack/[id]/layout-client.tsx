'use client'

import fcsdk from '@farcaster/miniapp-sdk'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import { usePinFeedMenuOption } from '@/lib/components/feeds-pinned'
import { MediaIcon, PostsIcon, StarterPackIcon } from '@/lib/components/icons'
import { Header, NavOutlet, UserAvatarsRow } from '@/lib/components/misc'
import { PaddedError, PaddedSpinner, Separator } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchStarterPack, fetchStarterPackMemberIds } from '@/lib/services/farcaster'
import { fetchUserFeed } from '@/lib/services/neynar'

export default function StarterPackScreen({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { id } = useParams()
  const pinFeedMenuOption = usePinFeedMenuOption()

  const { data: starterPack, isLoading } = useQuery({
    queryKey: ['pack', id],
    queryFn: () => fetchStarterPack(id as string),
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return <PaddedSpinner />
  if (!starterPack) return <PaddedError message="Starter Pack not found" />

  const openInFarcasterApp = () => {
    const url = `https://farcaster.xyz/${starterPack?.creator?.username}/pack/${starterPack?.id}`
    fcsdk?.actions?.openUrl?.(url)
  }

  return (
    <div className="">
      <Header
        menuOptions={[pinFeedMenuOption]}
        shareText={`Check out the feed for ${starterPack?.name} by @${starterPack?.creator?.username}!\n\n\n✴︎ mini app by @moe`}
      >
        <div>
          <div
            className="flex flex-row items-center gap-2 opacity-50 cursor-pointer"
            onClick={() => router.push('/starter-packs')}
          >
            <StarterPackIcon className="size-4 mt-[1]" />
            <h1 className="text-md font-medium">Starter Packs</h1>
          </div>
          <div className="text-3xl font-semibold">{starterPack?.name}</div>
          <div className="flex flex-row items-center gap-2 mt-2">
            <div className="text-sm opacity-50">by</div>
            <img className="size-4 rounded-full object-cover" src={starterPack?.creator?.pfp?.url}></img>
            <div className="text-sm font-medium opacity-75">{starterPack?.creator?.username}</div>
          </div>
        </div>
      </Header>

      <div className="p-4">
        <PackMembers starterPack={starterPack} onClick={openInFarcasterApp} />
      </div>

      <StarterPackNav />
      {children}
    </div>
  )
}

export function PackMembers({ starterPack, ...props }) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <UserAvatarsRow images={starterPack?.items?.map((i) => i?.item?.pfp?.url)} />
      <div className="text-sm opacity-50 whitespace-pre-line leading-[1]">
        {starterPack?.itemCount}
        {'\n'}users
      </div>
    </div>
  )
}

function StarterPackNav() {
  const { id } = useParams()
  const navLinks = [
    { Icon: PostsIcon, name: 'Posts', path: `/starter-pack/${id}` },
    { Icon: MediaIcon, name: 'Media', path: `/starter-pack/${id}/media` },
  ]
  return <NavOutlet navLinks={navLinks} />
}

export function StarterPackFeed({ id, display }: { id: string; display?: string }) {
  const auth = useAuth()

  const { data: starterPackMemberIds } = useQuery({
    queryKey: ['pack-members', id],
    queryFn: () => fetchStarterPackMemberIds(id as string),
    staleTime: 1000 * 60 * 5,
  })
  const userFids = starterPackMemberIds?.map((m) => m?.fid).join(',')

  return (
    <Feed
      queryKey={['pack-feed', userFids, auth?.userFid]}
      queryFn={({ pageParam }) =>
        fetchUserFeed({ fid: userFids, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })
      }
      display={display}
    />
  )
}
