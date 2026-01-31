'use client'

import { useRouter } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import { MiniAppsIcon } from '@/lib/components/icons'
import { TabsWithContent, TitleHeader } from '@/lib/components/misc'
import { Section } from '@/lib/components/ui'
import { fetchTrendingMiniApps } from '@/lib/services/neynar'

export default function MiniAppsScreen() {
  return (
    <div>
      <TitleHeader
        Icon={MiniAppsIcon}
        title="Mini Apps"
        shareText={`Check out Mini Apps on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />

      <TrendingMiniApps />
    </div>
  )
}

function TrendingMiniApps() {
  const miniAppCategories = [
    'trending',
    'games',
    'social',
    'finance',
    'utility',
    'productivity',
    'health-fitness',
    'news-media',
    'music',
    'shopping',
    'education',
    'developer-tools',
    'entertainment',
    'art-creativity',
  ]
  const tabs = miniAppCategories.map((category) => ({
    name: category,
    content: <MiniAppsCategory category={category == 'trending' ? '' : category} />,
  }))

  return <TabsWithContent tabs={tabs} initialTab={tabs[0].name} />
}

function MiniAppsCategory({ category }) {
  return (
    <MiniAppsGridFeed
      queryKey={['trending-mini-apps', category]}
      queryFn={({ pageParam }) => fetchTrendingMiniApps({ categories: category, cursor: pageParam })}
    />
  )
}

export function MiniAppsGridFeed({ queryKey, queryFn }) {
  return (
    <Feed
      queryKey={queryKey}
      queryFn={queryFn}
      renderItem={(item) => <MiniApp key={item.frames_url} miniapp={item} />}
      containerClass="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4"
    />
  )
}

function MiniApp({ miniapp }) {
  const router = useRouter()

  // const author = miniapp?.author

  const open = () => {
    // fcsdk?.actions?.openUrl(`https://farcaster.xyz/~/frames/launch?domain=${miniappHost(miniapp)}`)
    router.push(`/mini-app/${encodeURIComponent(miniapp.frames_url)}`)
  }

  return (
    <Section className="flex flex-col items-center gap-4 cursor-pointer" onClick={open}>
      <img
        src={miniapp.manifest?.frame?.icon_url}
        className="size-16 rounded-2xl"
        key={miniapp.manifest?.frame?.icon_url}
      />
      <div className="flex flex-col items-center shrink grow overflow-hidden">
        <div className="text-lg font-semibold text-center">{miniapp.manifest?.frame?.name}</div>
        <div className="text-xs opacity-50 break-words text-center">{miniappHost(miniapp)}</div>
        {/* <div className="flex flex-row items-center gap-1 mt-2">
          <img src={author?.pfp_url} className="size-3 rounded-full"></img>
          <div className="text-xs font-medium opacity-50 truncate">{author?.username}</div>
        </div> */}
      </div>
      {/* {context && (
        <Button size="lg" className="pl-0 pr-0 pt-0 pb-0 w-10 h-10 flex-none">
          <ArrowUpRight className="w-6 h-6" />
        </Button>
      )} */}
    </Section>
  )
}

const miniappHost = (miniapp) => new URL(miniapp.manifest?.frame?.home_url).hostname
