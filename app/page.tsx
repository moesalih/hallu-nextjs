'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SearchForm } from '@/app/search/page'
import { AccountSheet } from '@/lib/components/account-sheet'
import {
  AccountIcon,
  BrandIcon,
  ChannelIcon,
  DeveloperIcon,
  FeedIcon,
  MiniAppsIcon,
  NotificationIcon,
  SearchIcon,
  StarterPackIcon,
  StatsIcon,
  UserIcon,
} from '@/lib/components/icons'
import { Header } from '@/lib/components/misc'
import { Section } from '@/lib/components/ui'
import { accentColor, appDescription, appName } from '@/lib/metadata'
import { useAuth } from '@/lib/providers/auth-provider'
import { haptics } from '@/lib/utils/haptics'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto font-sans mb-10">
      <Header shareText={`Check out Sonar mini app by @moe!\n`} hideMenu primaryActions={<AccountButton />}>
        <BrandSection />
      </Header>
      <SearchForm />
      <FeatureGrid />
    </div>
  )
}

function BrandSection() {
  return (
    <div className="flex flex-row items-center gap-3 mb-4">
      <div
        className="flex flex-row items-center justify-center size-[50px] rounded-[12px]"
        style={{ backgroundColor: accentColor }}
      >
        <BrandIcon className="size-[33px] text-white" />
      </div>
      <div className="">
        <h1 className="text-3xl font-medium">{appName}</h1>
        <div className="text-xs opacity-50">{appDescription}</div>
      </div>
    </div>
  )
}

function AccountButton() {
  const auth = useAuth()
  const [showSheet, setShowSheet] = useState(false)

  if (auth?.farcasterMiniApp?.context) return null
  return (
    <div>
      {auth?.userImage ? (
        <img
          className="size-6 rounded-full object-cover m-1 cursor-pointer"
          src={auth?.userImage}
          onClick={() => setShowSheet(true)}
        />
      ) : (
        <AccountIcon className="size-6 m-1 cursor-pointer opacity-50" onClick={() => setShowSheet(true)} />
      )}
      <AccountSheet showSheet={showSheet} setShowSheet={setShowSheet} />
    </div>
  )
}

function FeatureGrid() {
  const router = useRouter()
  const auth = useAuth()

  const links = [
    { title: 'Feeds', Icon: FeedIcon, path: `/feeds` },
    { title: 'Channels', Icon: ChannelIcon, path: `/channels` },
    { title: 'Mini Apps', Icon: MiniAppsIcon, path: `/mini-apps` },
    { title: 'Starter Packs', Icon: StarterPackIcon, path: `/starter-packs` },
    { title: 'Search', Icon: SearchIcon, path: `/search` },
    auth?.readAuthenticated && { title: 'Notifications', Icon: NotificationIcon, path: '/notifications' },
    auth?.readAuthenticated && { title: 'My Profile', Icon: UserIcon, path: `/u/${auth?.username}` },
    // !auth?.farcasterMiniApp?.context && { title: 'Account', Icon: AccountIcon, path: '/account' },
    auth?.farcasterMiniApp?.context && { title: 'Farcaster SDK', Icon: DeveloperIcon, path: '/fc-sdk' },
    { title: 'Farcaster Stats', Icon: StatsIcon, path: `/fc-stats` },
    // { title: 'Users', Icon: Users, path: `/users` },
    // { title: 'Leaderboard', Icon: Trophy, path: `/leaderboard` },
  ].filter(Boolean) as { title: string; Icon: React.ComponentType<any>; path: string }[]

  const navigateTo = (path: string) => {
    haptics()
    router.push(path)
  }

  return (
    <div className="grid grid-cols-2 gap-4 m-4">
      {links.map(({ title, Icon, path }) => (
        <div key={title} onClick={() => navigateTo(path)}>
          <Section className="cursor-pointer flex flex-col items-center">
            <Icon className="size-10 opacity-50" />
            <div className="text-lg font-semibold text-center mt-3">{title}</div>
          </Section>
        </div>
      ))}
    </div>
  )
}
