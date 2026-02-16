'use client'

import { usePathname } from 'next/navigation'

import { ChannelFeed } from '@/app/c/[channelId]/layout-client'
import { StarterPackFeed } from '@/app/starter-pack/[id]/layout-client'
import { UserFeed } from '@/app/u/[username]/layout-client'
import { Feed } from '@/lib/components/feed'
import { ImageIcon, MediaIcon, PostsIcon, TrendingIcon } from '@/lib/components/icons'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchChannelsFeed, fetchExploreFeed, fetchFollowingFeed } from '@/lib/services/neynar'
import { fetchAllPosts } from '@/lib/services/trpc-client'

export function FeedFromCurrentPath() {
  const pathname = usePathname()
  return <FeedBySlug slug={pathname} />
}

export function FeedBySlug({ slug }: { slug: string }) {
  if (!slug) return null
  const display = slug.endsWith('/media') ? 'media' : undefined

  if (slug.startsWith('/feeds/following')) return <FollowingFeed display={display} />
  if (slug.startsWith('/feeds/explore')) return <ExploreFeed display={display} />
  if (slug.startsWith('/feeds/curated')) return <CuratedFeed display={display} />
  if (slug.startsWith('/c/')) return <ChannelFeed channelId={feedSlugToChannelId(slug)!} display={display} />
  if (slug.startsWith('/u/')) return <UserFeed username={feedSlugToUsername(slug)!} display={display} />
  if (slug.startsWith('/starter-pack/'))
    return <StarterPackFeed id={feedSlugToStarterPackId(slug)!} display={display} />
  return null
}

export function feedSlugToTitle(slug: string) {
  if (slug.startsWith('/feeds/following')) return 'Following'
  if (slug.startsWith('/feeds/explore')) return 'Trending'
  if (slug.startsWith('/feeds/curated/media')) return 'Curated Media'
  if (slug.startsWith('/c/')) return `/${feedSlugToChannelId(slug)}`
  if (slug.startsWith('/u/')) return `@${feedSlugToUsername(slug)}`
  if (slug.startsWith('/starter-pack/')) return starterPackIdToDisplayName(feedSlugToStarterPackId(slug)!)
  return slug
}

export function feedSlugToIcon(slug: string) {
  if (slug.startsWith('/feeds/following')) return PostsIcon
  if (slug.startsWith('/feeds/explore/media')) return MediaIcon
  if (slug.startsWith('/feeds/explore')) return TrendingIcon
  if (slug.startsWith('/feeds/curated')) return ImageIcon

  if (slug.endsWith('/media')) return MediaIcon
  return PostsIcon
}

function feedSlugToUsername(slug: string) {
  return slug.match(/\/u\/([^\/]+)/)?.[1]
}
function feedSlugToChannelId(slug: string) {
  return slug.match(/\/c\/([^\/]+)/)?.[1]
}
function feedSlugToStarterPackId(slug: string) {
  return slug.match(/\/starter-pack\/([^\/]+)/)?.[1]
}

function starterPackIdToDisplayName(id: string) {
  return id.replace(/-/g, ' ').replace(/ [^ ]*$/, '')
}

//////////

function FollowingFeed({ display }: { display?: string }) {
  const auth = useAuth()
  if (!auth?.userFid) return null
  return (
    <Feed
      queryKey={['following-feed', auth?.userFid]}
      queryFn={({ pageParam }) =>
        fetchFollowingFeed({ fid: auth?.userFid, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })
      }
      display={display}
    />
  )
}
function ExploreFeed({ display }: { display?: string }) {
  const auth = useAuth()
  return (
    <Feed queryKey={['explore-feed', auth?.userFid]} queryFn={({ pageParam }) => fetchAllPosts()} display={display} />
  )
}
function CuratedFeed({ display }: { display?: string }) {
  const auth = useAuth()
  const channelIds = ['photography', 'geometric', 'gifart', 'gen-art', 'bnw', 'abstract', 'pixelart', 'lightchasers']
  return (
    <Feed
      queryKey={['explore-feed-media', auth?.userFid]}
      queryFn={({ pageParam }) =>
        fetchChannelsFeed({ channelIds: channelIds, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })
      }
      display={display}
    />
  )
}
