import fcsdk, { Context } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

import { useAuth } from '@/lib/providers/auth-provider'
import { fetchNeynar } from '@/lib/services/neynar'

export function useFarcasterMiniApp() {
  const [context, setContext] = useState<Context.MiniAppContext>()
  useEffect(() => {
    fcsdk.context.then(setContext)
  }, [])
  return { context, fcsdk }
}

export function useFetchNeynarWithAuth() {
  const auth = useAuth()

  return async function (path: string, method = 'POST', body: any = null) {
    if (!auth?.neynarAuthUser?.signer_uuid) return
    const response = await fetchNeynar(path, method, {
      ...body,
      signer_uuid: auth?.neynarAuthUser?.signer_uuid,
    })
    return response?.success
  }
}
