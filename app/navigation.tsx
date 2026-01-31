import { usePathname, useRouter } from 'next/navigation'

import { BrandIcon, ChannelIcon, FeedIcon, NotificationIcon, SearchIcon, UserIcon } from '@/lib/components/icons'
import { useAuth } from '@/lib/providers/auth-provider'
import { haptics } from '@/lib/utils/haptics'

import { DynamicNotificationIcon } from './notifications/notifications-helpers'

export function Navigation({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const auth = useAuth()
  // if (!auth?.readAuthenticated) {
  //   return children
  // }

  if (pathname === '/') {
    return children
  }

  const tabs = [
    { title: 'Feeds', Icon: FeedIcon, path: `/feeds` },
    { title: 'Channels', Icon: ChannelIcon, path: `/channels` },
    { title: 'Search', Icon: SearchIcon, path: `/search` },
    auth?.readAuthenticated && { title: 'Notifications', Icon: DynamicNotificationIcon, path: `/notifications` },
    // auth?.readAuthenticated && { title: 'My Profile', Icon: UserIcon, path: `/u/${auth?.username}` },
    { title: 'Home', Icon: BrandIcon, path: `/` },
  ].filter(Boolean) as { title: string; Icon: React.ComponentType<any>; path: string }[]

  const navigateTo = (path: string) => {
    haptics()
    router.push(path)
  }

  return (
    <div className="mb-22">
      <nav className="fixed bottom-0 left-0 right-0 top-auto lg:right-auto lg:left-0 lg:top-0 lg:bottom-0 flex flex-col items-center justify-center z-10">
        <div className="absolute h-full w-full bg-linear-to-b lg:hidden from-white/0 to-white/80 dark:from-black/0 dark:to-black/80"></div>
        <div className="bg-white/75 dark:bg-black/75 backdrop-blur-md border border-neutral-400/25 px-4 py-0 lg:px-0 lg:py-4 m-4 rounded-full shadow-xl shadow-black/25 dark:shadow-black/60 x[--tw-shadow:0_5px_25px_0_var(--tw-shadow-color),0_2px_10px_0_var(--tw-shadow-color)]">
          <div className="flex flex-row lg:flex-col items-center justify-center gap-1">
            {tabs.map(({ title, Icon, path }) => {
              const activeClass = pathname.startsWith(path) && path !== '/' ? 'opacity-100' : 'opacity-50'
              return (
                <div
                  key={path}
                  onClick={() => navigateTo(path)}
                  className={`flex flex-col items-center cursor-pointer p-4 ${activeClass}`}
                >
                  <Icon className="size-6" />
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ height: auth?.farcasterMiniApp.context?.client.safeAreaInsets?.bottom || 0 }} />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
      {children}
      <div style={{ height: auth?.farcasterMiniApp.context?.client.safeAreaInsets?.bottom || 0 }} />
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  )
}
