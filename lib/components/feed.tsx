import { useInfiniteQuery } from '@tanstack/react-query'

import { Post, SmallMediaPost } from '@/lib/components/post'
import { Button, PaddedSpinner } from '@/lib/components/ui'

export function Feed({
  queryKey,
  queryFn,
  display = 'default',
  renderItem = undefined,
  containerClass = 'flex flex-col',
}: {
  queryKey: any
  queryFn: (nextPageParam: any) => Promise<any>
  display?: string
  renderItem?: (item: any) => React.ReactNode
  containerClass?: string
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: undefined,
  })

  const feed = data ? data.pages.flatMap((page) => page?.items || []) : []

  // console.log('Feed', queryKey, feed)

  if (isLoading) return <PaddedSpinner />

  return (
    <div className="">
      <FeedItems feed={feed} display={display} renderItem={renderItem} containerClass={containerClass} />

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex flex-row items-center justify-center p-4 opacity-50 h-32">
          <Button onClick={fetchNextPage} disabled={isFetching} variant="outline" size="sm" className="px-3">
            Load more
          </Button>
        </div>
      )}
      {isFetchingNextPage && <PaddedSpinner />}
    </div>
  )
}

function FeedItems({ feed, display, renderItem, containerClass = 'flex flex-col' }) {
  if (renderItem) {
    return <div className={containerClass}>{feed?.map((item) => renderItem(item))}</div>
  }

  if (display === 'media') {
    return (
      <div className="grid grid-cols-3 gap-[2px] ">
        {feed?.map((item) => (
          <SmallMediaPost key={item.id} cast={item} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {feed?.map((item) => (
        <Post key={item?.id} cast={item} />
      ))}
    </div>
  )
}
