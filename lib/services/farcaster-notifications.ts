import { supabase } from '@/lib/services/supabase-client'

const table = 'fc_notification_details'

export async function saveUserNotificationsDetails(fid: number, notificationDetails: any) {
  const { data, error } = await supabase.from(table).upsert(
    [
      {
        fid: fid,
        token: notificationDetails.token,
        url: notificationDetails.url,
        updated_at: new Date().toISOString(),
      },
    ],
    {
      onConflict: 'fid',
    }
  )
  console.log('🔔 saveUserNotificationsDetails', fid, notificationDetails, error)
  return data
}

export async function getUserNotificationsDetails(fid: number): Promise<any> {
  const { data, error } = await supabase.from(table).select().eq('fid', fid).single()
  return data
}

//////////

export async function sendNotificationToUser(fid: number, payload: any) {
  const notificationDetails = await getUserNotificationsDetails(fid)
  if (!notificationDetails) {
    console.log('🔔 sendNotificationToUser: user not found', fid)
    return
  }

  console.log('🔔 sendNotificationToUser', fid)
  return await sendNotification(notificationDetails, payload)
}

export async function sendNotificationToAllUsers(payload: any) {
  const { data, error } = await supabase.from(table).select()
  if (error) {
    console.error('🔔 sendNotificationToAllUsers: error fetching users', error)
    return
  }

  for (const notificationDetails of data) {
    console.log('🔔 sendNotificationToAllUsers', notificationDetails.fid)
    try {
      await sendNotification(notificationDetails, payload)
    } catch (error) {
      console.error('🔔 sendNotificationToAllUsers: error sending to', notificationDetails.fid, error)
    }
  }
  console.log('🔔 sendNotificationToAllUsers: done')
}

async function sendNotification(notificationDetails: any, payload: any) {
  return await fetch(notificationDetails.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notificationId: Math.random().toString(36), // TODO: generate a unique id
      tokens: [notificationDetails.token],
      ...payload,
    }),
  }).then((res) => res.json())
}
