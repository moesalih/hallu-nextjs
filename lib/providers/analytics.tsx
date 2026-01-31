import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/lib/providers/auth-provider'
import { sendAnalyticsEvent } from '@/lib/services/supabase-client'

export const Analytics = ({}) => {
  const auth = useAuth()

  const analyticsEvent = (event: string, param?: string) => {
    return sendAnalyticsEvent({ event, param, fid: auth?.userFid, platform: auth?.platform })
  }

  useEffect(() => {
    if (!auth?.userFid) return
    // analyticsEvent('app_open', undefined)
    if (auth.farcasterMiniApp.context)
      analyticsEvent('miniapp_open', JSON.stringify(fcMiniAppContextData(auth.farcasterMiniApp.context)))
  }, [auth?.userFid])

  const pathname = usePathname()
  const path = pathname
  let cleanedPath = path
  if (cleanedPath && cleanedPath?.length > 1 && cleanedPath?.endsWith('/')) cleanedPath = cleanedPath.slice(0, -1)

  useEffect(() => {
    if (!auth?.userFid) return
    analyticsEvent('screen_view', cleanedPath)
  }, [cleanedPath, auth?.userFid])

  return null
}

const fcMiniAppContextData = (context: any) => {
  const location: any = {
    // ...context?.location,
    clientFid: context?.client?.clientFid,
    locationType: context?.location?.type,
  }
  if (context?.location?.type == 'cast_embed') location.locationId = context?.location.cast?.hash
  if (context?.location?.type == 'cast_share') location.locationId = context?.location.cast?.hash
  if (context?.location?.type == 'notification') location.locationId = context?.location?.notification?.title
  return location
}
