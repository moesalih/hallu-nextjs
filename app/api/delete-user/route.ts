import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/services/supabase-server'
import { deleteFromR2 } from '@/lib/services/r2'

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')
  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 })
  }

  // Look up user
  const users = await dbQuery('SELECT id FROM users WHERE username = $1', [username])
  if (users.length === 0) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }
  const userId = users[0].id

  // Fetch all posts to collect image URLs
  const posts = await dbQuery('SELECT images FROM posts WHERE user_id = $1', [userId])
  const imageUrls: string[] = posts.flatMap((post: any) => post.images || [])

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
  const deletedPosts = await dbQuery('DELETE FROM posts WHERE user_id = $1', [userId])

  // Delete the user
  await dbQuery('DELETE FROM users WHERE id = $1', [userId])

  return NextResponse.json({
    deleted: {
      user: username,
      posts: deletedPosts.count,
      images: imagesDeleted,
      imageUrls,
    },
  })
}
