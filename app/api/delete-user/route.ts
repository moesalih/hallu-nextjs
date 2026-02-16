import { NextRequest, NextResponse } from 'next/server'

import { dbQuery } from '@/lib/services/cloudflare-d1'
import { deleteFromR2 } from '@/lib/services/cloudflare-r2'
import { fetchUserByUsername, fetchUserPosts } from '@/lib/services/db'

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')
  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 })
  }

  const user = await fetchUserByUsername({ username })
  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }
  const userId = user.id

  const posts = await fetchUserPosts({ username })
  const imageUrls: string[] = posts.items.flatMap((post: any) => post.images || [])

  // Delete images from R2
  let imagesDeleted = 0
  if (imageUrls.length > 0) {
    const r2Keys = imageUrls
      .map((url: string) => {
        const match = url.match(/r2\.dev\/(.+)$/)
        return match ? match[1] : null
      })
      .filter(Boolean) as string[]

    if (r2Keys.length > 0) {
      try {
        await deleteFromR2(r2Keys)
        imagesDeleted = r2Keys.length
      } catch (error: any) {
        return NextResponse.json({ error: 'failed to delete images', details: error.message }, { status: 500 })
      }
    }
  }

  // Delete all posts
  const deletedPosts = await dbQuery({ sql: 'DELETE FROM posts WHERE user_id = $1', params: [userId] })

  // Delete the user
  await dbQuery({ sql: 'DELETE FROM users WHERE id = $1', params: [userId] })

  return NextResponse.json({
    deleted: {
      user: username,
      posts: deletedPosts.count,
      images: imagesDeleted,
      imageUrls,
    },
  })
}
