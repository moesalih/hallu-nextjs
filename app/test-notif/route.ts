import { NextRequest } from 'next/server'

import { appName } from '@/lib/metadata'
import { sendNotificationToUser } from '@/lib/services/farcaster-notifications'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = url.origin
  const fid = Number(request.nextUrl.searchParams.get('fid'))
  const title = request.nextUrl.searchParams.get('title') || appName + ' test notification'
  const body = request.nextUrl.searchParams.get('body') || 'Hello, World!'

  if (!fid) {
    return Response.json({ error: 'fid is required' })
  }

  console.log('[miniapp-test-notif]', { fid, title, body })

  try {
    const res = await sendNotificationToUser(fid, {
      title,
      body,
      targetUrl: baseUrl,
    })
    console.log('[miniapp-test-notif]', res)
    return Response.json({ res })
  } catch (err: any) {
    console.error('[miniapp-test-notif]', err)
    return Response.json({ error: err?.message })
  }
}
