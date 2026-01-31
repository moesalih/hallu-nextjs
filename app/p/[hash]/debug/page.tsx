'use client'

import { usePostFromParams } from '@/app/p/[hash]/layout'
import { Debug } from '@/lib/components/ui'

export default function PostDebug() {
  const { data: post } = usePostFromParams()
  if (!post) return null
  return <Debug title="Neynar Data" className="p-4" data={post} />
}
