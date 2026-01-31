'use client'

import { usePostFromParams } from '@/app/p/[hash]/layout'
import { Feed } from '@/lib/components/feed'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchCastReplies } from '@/lib/services/neynar'

export default function PostReplies() {
  const auth = useAuth()
  const { data: post } = usePostFromParams()
  return (
    <Feed
      queryKey={['post-replies', post?.hash, auth?.userFid]}
      queryFn={({ pageParam }) =>
        fetchCastReplies({ hash: post?.hash, cursor: pageParam, viewer_fid: auth?.userFid?.toString() })
      }
    />
  )
}
