'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { Feed } from '@/lib/components/feed'
import { ChannelIcon, MiniAppsIcon, PostsIcon, SearchIcon, UsersIcon } from '@/lib/components/icons'
import { TabsWithContent, TitleHeader } from '@/lib/components/misc'
import { Button, Input, Section } from '@/lib/components/ui'
import { fetchSearchCasts, fetchSearchChannels, fetchSearchMiniApps, fetchSearchUsers } from '@/lib/services/neynar'

import { ChannelsGridFeed } from '../channels/page'
import { MiniAppsGridFeed } from '../mini-apps/page'
import { UsersGridFeed } from '../users/page'

export default function Wrapper() {
  return (
    <Suspense>
      <SearchScreen />
    </Suspense>
  )
}

function SearchScreen() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  return (
    <div>
      <TitleHeader Icon={SearchIcon} title="Search" shareText={`Check out Sonar.\n\n\n✴︎ mini app by @moe!\n`} />

      <SearchForm query={query} setQuery={setQuery} />
      {query && <SearchTabs q={query} />}
    </div>
  )
}

function SearchTabs({ q }) {
  const tabs = [
    {
      Icon: PostsIcon,
      name: 'Casts',
      content: (
        <Feed
          queryKey={['search-casts', q]}
          queryFn={({ pageParam }) => fetchSearchCasts({ q, sort_type: 'desc_chron', cursor: pageParam })}
        />
      ),
    },
    {
      Icon: UsersIcon,
      name: 'Users',
      content: (
        <UsersGridFeed
          queryKey={['search-users', q]}
          queryFn={({ pageParam }) => fetchSearchUsers({ q, cursor: pageParam })}
        />
      ),
    },
    {
      Icon: ChannelIcon,
      name: 'Channels',
      content: (
        <ChannelsGridFeed
          queryKey={['search-channels', q]}
          queryFn={({ pageParam }) => fetchSearchChannels({ q, cursor: pageParam })}
        />
      ),
    },
    {
      Icon: MiniAppsIcon,
      name: 'Mini Apps',
      content: (
        <MiniAppsGridFeed
          queryKey={['search-mini-apps', q]}
          queryFn={({ pageParam }) => fetchSearchMiniApps({ q, cursor: pageParam })}
        />
      ),
    },
  ]
  return <TabsWithContent tabs={tabs} initialTab={tabs[0]?.name} />
}

export function SearchForm({ query, setQuery }: { query?: string; setQuery?: (query: string) => void }) {
  const router = useRouter()
  const [inputQuery, setInputQuery] = useState(query || '')

  const onSearch = () => {
    if (!inputQuery) return

    if (inputQuery.startsWith('fid:')) {
      router.push(`/u/${inputQuery}`)
      return
    }
    if (inputQuery.startsWith('@')) {
      const username = inputQuery.replace('@', '')
      router.push(`/u/${username}`)
      return
    }
    if (inputQuery.startsWith('/')) {
      const channelId = inputQuery.replace('/', '')
      router.push(`/c/${channelId}`)
      return
    }
    if (inputQuery.startsWith('0x')) {
      router.push(`/p/${inputQuery}`)
      return
    }
    if (inputQuery.startsWith('https://')) {
      router.push(`/mini-app/${encodeURIComponent(inputQuery)}`)
      return
    }

    console.log('onSearch', inputQuery)
    if (setQuery) setQuery(inputQuery)
    else router.push(`/search?q=${encodeURIComponent(inputQuery)}`)
  }

  return (
    <Section className="flex flex-row gap-4 m-4">
      <form
        className="flex flex-row gap-4 flex-1 m-0"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <Input
          size="lg"
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="@user, fid:123, /channel, cast hash, mini app url"
          // autoCapitalize="on"
          // autoCorrect="on"
          type="text"
          value={inputQuery}
          className="flex-1"
        />
        <Button size="lg" disabled={!inputQuery} type="submit">
          <SearchIcon className="size-5" />
        </Button>
      </form>
    </Section>
  )
}
