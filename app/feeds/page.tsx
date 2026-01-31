'use client'

import { useMemo } from 'react'

import { ComposeButton } from '@/lib/components/compose-button'
import { FeedBySlug, feedSlugToIcon, feedSlugToTitle } from '@/lib/components/feeds'
import { ManagePinnedTabs, usePinnedFeeds } from '@/lib/components/feeds-pinned'
import { FeedIcon, SettingsIcon } from '@/lib/components/icons'
import { TabsWithContent, TitleHeader } from '@/lib/components/misc'
import { useAuth } from '@/lib/providers/auth-provider'

export default function FeedsScreen() {
  return (
    <div>
      <TitleHeader Icon={FeedIcon} title="Feeds" primaryActions={<ComposeButton />} />
      <FeedsNav />
    </div>
  )
}

function FeedsNav() {
  const auth = useAuth()
  // const [pinnedFeeds] = usePinnedFeeds()
  const pinnedFeeds = ['/feeds/trending']
  const tabs = useMemo(
    () => [
      ...pinnedFeeds.map(feedSlugToTabConfig),
      // auth?.userFid && { Icon: SettingsIcon, id: 'manage', content: <ManagePinnedTabs /> },
    ],
    [pinnedFeeds, auth?.userFid],
  )
  return <TabsWithContent tabs={tabs} />
}

function feedSlugToTabConfig(slug: string) {
  return {
    id: slug,
    Icon: feedSlugToIcon(slug),
    name: feedSlugToTitle(slug),
    content: <FeedBySlug slug={slug} />,
  }
}
