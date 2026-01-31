'use client'

import fcsdk from '@farcaster/miniapp-sdk'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { Analytics } from '@/lib/providers/analytics'
import { AuthProvider } from '@/lib/providers/auth-provider'

import { Navigation } from './navigation'

const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [farcasterMiniApp(), injected()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http('https://mainnet.base.org'),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    fcsdk.actions.ready()
    // fcsdk.back?.enableWebNavigation()
    fcsdk.actions.addMiniApp().catch(() => {})
    fcsdk.context.then((context) => {
      if (context?.location?.type == 'cast_share') router.push(`/p/${context?.location?.cast?.hash}`)
    })
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Navigation>{children}</Navigation>
          <Analytics />
          <Toaster
            toastOptions={{
              className:
                'bg-white! text-black! dark:bg-black! dark:text-white! border border-neutral-400/25 shadow text-sm rounded-full!',
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
