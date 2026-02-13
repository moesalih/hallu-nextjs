import { NextRequest, NextResponse } from 'next/server'

import { fetchUserByUsername } from '@/lib/services/hallu-server'

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')
  if (!username) {
    return NextResponse.json({ ok: false, error: 'username is required' }, { status: 400 })
  }

  try {
    const data = await fetchUserByUsername(username)

    if (!data) {
      return NextResponse.json({ ok: false, error: 'user not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Failed to fetch user',
      },
      { status: 500 },
    )
  }
}
