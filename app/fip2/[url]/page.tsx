'use client'

import { useUrlFromParams } from './layout-client'
import { Feed } from '@/lib/components/feed'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchFip2Feed } from '@/lib/services/neynar'

export default function ChannelFeed() {
  const auth = useAuth()
  const url = useUrlFromParams()
  if (!url) return null
  return (
    <Feed
      queryKey={['fip2-feed', url, auth?.userFid]}
      queryFn={({ pageParam }) => fetchFip2Feed({ url, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })}
    />
  )
}
