'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { DebugIcon, ReplyIcon } from '@/lib/components/icons'

import { Header, NavOutlet } from '@/lib/components/misc'
import { Post } from '@/lib/components/post'
import { fetchCast } from '@/lib/services/neynar'
import { PaddedError, PaddedSpinner } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'

export default function PostScreen({ children }: { children: React.ReactNode }) {
  const { data: post, isLoading } = usePostFromParams()

  if (isLoading) return <PaddedSpinner />
  if (!post) return <PaddedError message="Post not found" />

  return (
    <div>
      <Header shareText={`Check out this post on Sonar.\n\n\n✴︎ mini app by @moe!\n`} />
      <ParentPost cast={post} />
      <Post cast={post} display="expanded" hideSeparator />
      <div className="mb-3"></div>

      <PostNav />
      {children}
    </div>
  )
}

function PostNav() {
  const { hash } = useParams()
  const navLinks = [
    { Icon: ReplyIcon, name: 'Replies', path: `/p/${hash}` },
    { Icon: DebugIcon, name: 'Debug', path: `/p/${hash}/debug` },
  ]
  return <NavOutlet navLinks={navLinks} />
}

const ParentPost = ({ cast, numParents = 5 }) => {
  const parentPostId = cast?.parent_hash
  if (!parentPostId) return null
  const { data: parentPost } = usePost(parentPostId)
  return (
    <div>
      {parentPost && numParents > 0 && <ParentPost cast={parentPost} numParents={numParents - 1} />}
      {parentPost && <Post cast={parentPost} hideSeparator />}
    </div>
  )
}

export function usePostFromParams() {
  const { hash } = useParams()
  return usePost(hash as string)
}

export function usePost(hash: string | undefined) {
  const auth = useAuth()
  return useQuery({
    queryKey: ['post', hash, auth?.userFid],
    queryFn: () => fetchCast({ hash, viewer_fid: auth?.userFid?.toString() }),
    staleTime: 1000 * 60 * 5,
    enabled: !!hash,
  })
}
