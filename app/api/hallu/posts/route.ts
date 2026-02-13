import { NextResponse } from 'next/server'

import { fetchAllPosts } from '@/lib/services/hallu-server'

export async function GET() {
  try {
    const data = await fetchAllPosts()
    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Failed to fetch posts',
      },
      { status: 500 },
    )
  }
}
