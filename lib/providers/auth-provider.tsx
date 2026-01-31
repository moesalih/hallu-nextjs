import { NeynarContextProvider, Theme, NeynarAuthButton, useNeynarContext } from '@neynar/react'
import { createContext, useContext, useRef } from 'react'

import { useFarcasterMiniApp } from '@/lib/utils/farcaster'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeynarContextProvider settings={{ clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '' }}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </NeynarContextProvider>
  )
}

type AuthContextData = {
  userFid: number | undefined
  username: string | undefined
  userImage: string | undefined
  readAuthenticated: boolean
  writeAuthenticated: boolean
  platform: string

  login: () => Promise<void>
  logout: () => Promise<void>
  farcasterMiniApp: ReturnType<typeof useFarcasterMiniApp>
  neynarAuthUser: ReturnType<typeof useNeynarContext>['user']
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const neynarContext = useNeynarContext()
  const neynarBtnRef = useRef<HTMLDivElement>(null)

  const farcasterMiniApp = useFarcasterMiniApp()

  const neynarAuthUser = neynarContext.user
  const userFid = neynarAuthUser?.fid || farcasterMiniApp.context?.user?.fid || undefined
  const username = neynarAuthUser?.username || farcasterMiniApp.context?.user?.username || undefined
  const userImage = neynarAuthUser?.pfp_url || farcasterMiniApp.context?.user?.pfpUrl || undefined
  const readAuthenticated = neynarContext.isAuthenticated || !!farcasterMiniApp.context?.user
  const writeAuthenticated = neynarContext.isAuthenticated && !!neynarContext.user?.signer_uuid
  const platform = farcasterMiniApp.context ? 'miniapp' : isPwa() ? 'pwa' : 'web'

  const login = async () => {
    neynarBtnRef.current?.querySelector('button')?.click()
  }
  const logout = async () => {
    neynarContext.logoutUser()
  }

  const value = {
    userFid,
    username,
    userImage,
    readAuthenticated,
    writeAuthenticated,
    platform,

    login: login,
    logout: logout,
    farcasterMiniApp,
    neynarAuthUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div ref={neynarBtnRef} style={{ display: 'none' }}>
        <NeynarAuthButton />
      </div>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

function isPwa() {
  return (
    global?.window?.matchMedia('(display-mode: standalone)').matches ||
    global?.window?.matchMedia('(display-mode: fullscreen)').matches ||
    (global?.window?.navigator as any)?.standalone === true
  )
}
