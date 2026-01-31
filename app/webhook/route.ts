import { NextRequest, NextResponse } from 'next/server'

import { appUrl, appName } from '@/lib/metadata'
import { saveUserNotificationsDetails, sendNotificationToUser } from '@/lib/services/farcaster-notifications'

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log(body)

  const header = decodeBase64Json(body.header)
  const payload = decodeBase64Json(body.payload)

  // TODO: verify webhook signature

  const fid = header?.fid
  const event = payload?.event

  console.log('[miniapp-webhook]', header, payload)

  if ((event === 'frame_added' || event === 'notifications_enabled') && payload?.notificationDetails) {
    await saveUserNotificationsDetails(fid, payload?.notificationDetails)
    const res = await sendWelcomeNotification(fid, appUrl)
    console.log('[miniapp-webhook]', res)
    // saveUserNotificationsDetails(fid, payload?.notificationDetails)
    //   .then(() => sendWelcomeNotification(fid, appUrl))
    //   .then((res) => {
    //     console.log('[miniapp-webhook]', res)
    //   })
    //   .catch((err) => {
    //     console.error('[miniapp-webhook]', err)
    //   })
  }

  return Response.json({})
}

const decodeBase64Json = (str: string) => JSON.parse(Buffer.from(str, 'base64').toString('utf-8'))

async function sendWelcomeNotification(fid: number, baseUrl: string) {
  return await sendNotificationToUser(fid, {
    title: appName + ' installed!',
    body: '🚀🚀🚀🚀🚀',
    targetUrl: baseUrl,
  })
}
