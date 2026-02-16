'use client'

import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { feedSlugToIcon, feedSlugToTitle } from '@/lib/components/feeds'
import { Section } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { haptics } from '@/lib/utils/haptics'
import { useLocalStorageState } from '@/lib/utils/local-storage'

export function usePinFeedMenuOption() {
  const pathname = usePathname()
  const auth = useAuth()
  const [pinnedFeeds, setPinnedFeeds] = usePinnedFeeds()

  return useMemo(() => {
    if (!pathname || !auth?.userFid) return undefined
    return {
      title: pinnedFeeds?.includes(pathname) ? 'Unpin Feed' : 'Pin Feed',
      onClick: () => {
        haptics()
        setPinnedFeeds((prev) => {
          if (prev?.includes(pathname)) return prev.filter((p) => p !== pathname)
          else return [...(prev || []), pathname]
        })
      },
    }
  }, [pathname, pinnedFeeds, auth?.userFid])
}

const DEFAULT_FEEDS = ['/feeds/following', '/feeds/explore', '/feeds/curated/media']

export function usePinnedFeeds() {
  const auth = useAuth()
  const [pinnedFeeds, setPinnedFeeds] = useLocalStorageState<string[]>(`${auth?.userFid}:pinned-feeds`, DEFAULT_FEEDS)

  const filteredFeeds =
    useMemo(
      () => (auth?.userFid ? pinnedFeeds : pinnedFeeds?.filter((f) => f !== '/feeds/following')),
      [pinnedFeeds, auth?.userFid],
    ) || []

  return [filteredFeeds, setPinnedFeeds] as const
}

export function ManagePinnedTabs() {
  const [pinnedFeeds, setPinnedFeeds] = usePinnedFeeds()

  const moveUp = (slug: string) => {
    setPinnedFeeds((prev) => {
      const arr = [...(prev || [])]
      const index = arr.indexOf(slug)
      if (index <= 0) return arr
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr
    })
  }

  const moveDown = (slug: string) => {
    setPinnedFeeds((prev) => {
      const arr = [...(prev || [])]
      const index = arr.indexOf(slug)
      if (index === -1 || index >= arr.length - 1) return arr
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr
    })
  }

  const remove = (slug: string) => {
    setPinnedFeeds((prev) => prev?.filter((s) => s !== slug) || [])
  }

  const add = (slug: string) => {
    setPinnedFeeds((prev) => [...(prev || []), slug])
  }

  const removedDefaults = DEFAULT_FEEDS.filter((f) => !pinnedFeeds.includes(f))

  return (
    <div>
      <Section className="flex flex-col m-4 p-0! overflow-hidden">
        {pinnedFeeds.map((slug, i) => {
          const Icon = feedSlugToIcon(slug)
          return (
            <div
              key={slug}
              className="flex items-center gap-3 px-4 py-3 border-b border-neutral-400/10 last:border-b-0"
            >
              <Icon className="size-4" />
              <span className="flex-1 text-sm">{feedSlugToTitle(slug)}</span>
              <button
                onClick={() => moveUp(slug)}
                disabled={i === 0}
                className="p-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronUp className="size-5" />
              </button>
              <button
                onClick={() => moveDown(slug)}
                disabled={i === pinnedFeeds.length - 1}
                className="p-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronDown className="size-5" />
              </button>
              <button onClick={() => remove(slug)} className="p-1 cursor-pointer">
                <X className="size-5" />
              </button>
            </div>
          )
        })}
      </Section>

      {removedDefaults.length > 0 && (
        <Section className="flex flex-col m-4 p-0! overflow-hidden">
          {removedDefaults.map((slug) => {
            const Icon = feedSlugToIcon(slug)
            return (
              <div
                key={slug}
                className="flex items-center gap-3 px-4 py-3 border-b border-neutral-400/10 last:border-b-0"
              >
                <Icon className="size-4" />
                <span className="flex-1 text-sm">{feedSlugToTitle(slug)}</span>
                <button onClick={() => add(slug)} className="p-1 cursor-pointer">
                  <Plus className="size-5" />
                </button>
              </div>
            )
          })}
        </Section>
      )}

      <div className="text-sm opacity-50 text-center p-10">
        Pin additional feeds from any channel, user, or starter pack feed page.
      </div>
    </div>
  )
}
