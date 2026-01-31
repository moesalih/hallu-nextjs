'use client'

import { useRouter } from 'next/navigation'

import { Feed } from '@/lib/components/feed'
import {
  FollowIcon,
  LikeIcon,
  MentionIcon,
  NotificationIcon,
  QuoteIcon,
  ReplyIcon,
  RepostIcon,
} from '@/lib/components/icons'
import { TabsWithContent, TitleHeader, UserAvatarsRow } from '@/lib/components/misc'
import { useAuth } from '@/lib/providers/auth-provider'
import { formatDateRelative } from '@/lib/utils/format'
import { useEffect } from 'react'
import { useFetchNeynarWithAuth } from '@/lib/utils/farcaster'

import { useNotificationsQueryProps } from './notifications-helpers'

export default function NotificationsScreen() {
  const auth = useAuth()
  const fetchNeynarWithAuth = useFetchNeynarWithAuth()

  useEffect(() => {
    delay(2000).then(() => fetchNeynarWithAuth('notifications/seen', 'POST', {}))
  }, [auth?.userFid, fetchNeynarWithAuth])

  if (!auth?.userFid) return null

  return (
    <div>
      <TitleHeader Icon={NotificationIcon} title="Notifications" />
      <NotificationTabs />
    </div>
  )
}

function NotificationTabs() {
  const tabs = [
    { name: 'All', type: '' },
    { name: 'Replies', type: 'replies' },
    { name: 'Mentions', type: 'mentions' },
    { name: 'Likes', type: 'likes' },
    { name: 'Recasts', type: 'recasts' },
    { name: 'Quotes', type: 'quotes' },
    { name: 'Follows', type: 'follows' },
  ].map((tab) => ({
    id: tab.type || 'all',
    name: tab.name,
    Icon: typeIcons[tab.type],
    content: <NotificationsFeed type={tab.type} />,
  }))

  return <TabsWithContent tabs={tabs} />
}

function NotificationsFeed({ type }: { type: string }) {
  const queryProps = useNotificationsQueryProps({ type })
  const showUnseenDot = type === ''
  if (!queryProps) return null
  return (
    <Feed
      queryKey={queryProps.queryKey}
      queryFn={queryProps.queryFn}
      renderItem={(notif) => (
        <NotificationRow key={notif.most_recent_timestamp} notif={notif} showUnseenDot={showUnseenDot} />
      )}
    />
  )
}

function NotificationRow({ notif, showUnseenDot = true }: { notif: any; showUnseenDot?: boolean }) {
  const router = useRouter()

  const label = typeLabels[notif.type] || notif.type
  const Icon = typeIcons[notif.type]
  const users = notif.follows || notif.reactions || (notif.cast?.author ? [notif.cast.author] : []) || []
  const images = users
    .slice(0, 6)
    .map((u: any) => u.user?.pfp_url || u.pfp_url)
    .filter(Boolean)
  const usernames = users.map((u: any) => u.user?.username || u.username).filter(Boolean)
  const displayName = usernames.length > 0 ? usernames.slice(0, 3).join(', ') : 'Someone'
  const extra = usernames.length > 3 ? ` +${usernames.length - 3}` : ''

  return (
    <div className="p-4 border-b border-neutral-400/25">
      <div className="flex flex-row items-start gap-3">
        {Icon && (
          <div className="flex flex-col items-center w-6 opacity-50 pt-1 shrink-0">
            <Icon className="size-5" />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0 grow">
          <UserAvatarsRow images={images} sizeClass="size-8" marginClass="mr-1" />
          <div className="">
            <span className="font-semibold">
              {displayName} {extra}
            </span>
            <span className=""> {label}</span>
          </div>
          {notif.cast && (
            <div
              className="text-sm opacity-50 wrap-break-word line-clamp-2 cursor-pointer"
              onClick={() => router.push(`/p/${notif.cast.hash}`)}
            >
              {notif.cast.text || '◼︎'}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end grow-0 gap-1">
          <span className="opacity-50 text-sm ml-auto">{formatDateRelative(notif.most_recent_timestamp)}</span>
          {showUnseenDot && !notif?.seen && <div className="size-2 bg-black dark:bg-white rounded-full"></div>}
        </div>
      </div>
    </div>
  )
}

const typeLabels: Record<string, string> = {
  follows: 'followed you',
  recasts: 'recasted your cast',
  likes: 'liked your cast',
  reply: 'replied to your cast',
  mention: 'mentioned you',
  quote: 'quoted you',
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  follows: FollowIcon,
  recasts: RepostIcon,
  likes: LikeIcon,
  replies: ReplyIcon,
  reply: ReplyIcon,
  mentions: MentionIcon,
  mention: MentionIcon,
  quotes: QuoteIcon,
  quote: QuoteIcon,
}

function delay(ms?: number) {
  return new Promise((resolve) => setTimeout(resolve, ms || 150))
}
