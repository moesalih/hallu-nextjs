import { fetchDirectOrProxyJSON } from '@/lib/utils/fetch'

const baseUrl = 'https://api.neynar.com/v2/farcaster/'

export async function fetchNeynar(path: string, method = 'GET', body: any = null) {
  return await fetchDirectOrProxyJSON(baseUrl + path, method, body)
}

export async function fetchNeynarPages(path: string, pages: number, dataKey: string) {
  let data: any = []
  let cursor = ''
  let pagesLeft = pages
  while (true) {
    const res = await fetchNeynar(`${path}&cursor=${cursor}`)
    data = [...data, ...res[dataKey]]
    cursor = res?.next?.cursor
    pagesLeft--
    if (!cursor || pagesLeft <= 0) {
      break
    }
  }
  return {
    [dataKey]: data,
  }
}

//////////

export function fetchUser({ username, viewer_fid = '' }) {
  if (username.startsWith('fid:')) {
    return fetchUsersById({ fids: username.replace('fid:', ''), viewer_fid }).then((users) => users[0])
  }
  return fetchNeynar(`user/by_username?username=${username}${viewer_fid ? `&viewer_fid=${viewer_fid}` : ''}`).then(
    (r) => r.user,
  )
}
export function fetchUsersById({ fids, viewer_fid = '' }) {
  return fetchNeynar(`user/bulk?fids=${fids}${viewer_fid ? `&viewer_fid=${viewer_fid}` : ''}`).then((r) => r.users)
}

export function fetchSearchUsers({ q, cursor = '' }) {
  return fetchNeynar(`user/search?limit=10&q=${q}&cursor=${cursor}`).then((r) => ({
    items: r?.result?.users || [],
    nextPageParam: r?.result?.next?.cursor || null,
  }))
}

function defaultCastFeedTransform(response: any) {
  return {
    items: response?.casts || [],
    nextPageParam: response?.next?.cursor || null,
  }
}

export function fetchUserFeed({ fid, cursor = '', viewer_fid = '' }) {
  const path = `feed?feed_type=filter&filter_type=fids&fids=${fid}&with_recasts=false&with_replies=false&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchChannel({ channelId, viewer_fid = '' }) {
  return fetchNeynar(`channel?id=${channelId}&viewer_fid=${viewer_fid}`).then((r) => r.channel)
}

export function fetchChannelFeed({ channelId, cursor = '', viewer_fid = '' }) {
  const path = `feed/channels?channel_ids=${channelId}&with_recasts=false&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchChannelsFeed({ channelIds, cursor = '', viewer_fid = '' }) {
  const path = `feed/channels?channel_ids=${channelIds.join(
    ',',
  )}&with_recasts=false&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchFip2Feed({ url, cursor = '', viewer_fid = '' }) {
  const path = `feed?feed_type=filter&filter_type=parent_url&parent_url=${url}&with_recasts=false&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchExploreFeed({ cursor = '', viewer_fid = '' }) {
  // return fetchNeynar(`feed/trending?time_window=24h&limit=10`).then(defaultCastFeedTransform)
  const path = `feed?feed_type=filter&filter_type=global_trending&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchUsersFeed({ fids, cursor = '', viewer_fid = '' }) {
  const path = `feed?feed_type=filter&filter_type=fids&fids=${fids}&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchFollowingFeed({ fid, cursor = '', viewer_fid = '' }) {
  const path = `feed/following?fid=${fid}&limit=50&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then(defaultCastFeedTransform)
}

export function fetchCast({ hash, viewer_fid = '' }) {
  return fetchNeynar(`cast?type=hash&identifier=${hash}&viewer_fid=${viewer_fid}`).then((r) => r.cast)
}

export function fetchCastReplies({ hash, cursor = '', viewer_fid = '' }) {
  const path = `cast/conversation?identifier=${hash}&type=hash&reply_depth=2&include_chronological_parent_casts=false&sort_type=algorithmic&fold=above&limit=20&cursor=${cursor}&viewer_fid=${viewer_fid}`
  return fetchNeynar(path).then((r) => ({
    items: r?.conversation?.cast?.direct_replies || [],
    nextPageParam: r?.next?.cursor || null,
  }))
}

export function fetchUserChannels({ fid, cursor = '' }) {
  return fetchNeynar(`user/channels?fid=${fid}&limit=30&cursor=${cursor}`).then(defaultChannelsTransform)
}
export function fetchSearchChannels({ q, cursor = '' }) {
  return fetchNeynar(`channel/search?q=${q}&limit=30&cursor=${cursor}`).then(defaultChannelsTransform)
}
const defaultChannelsTransform = (response: any) => {
  return {
    items: response?.channels || [],
    nextPageParam: response?.next?.cursor || null,
  }
}
export function fetchTrendingChannels({ cursor = '' }) {
  return fetchNeynar(`channel/trending?time_window=30d&limit=24&cursor=${cursor}`).then((r) => ({
    items: r.channels?.map((c) => c.channel) || [],
    nextPageParam: r?.next?.cursor || null,
  }))
}

export function fetchTrendingMiniApps({ categories = '', cursor = '' }) {
  const path = `frame/catalog?limit=30&categories=${categories}&cursor=${cursor}`
  return fetchNeynar(path).then(defaultMiniAppTransform)
}
export function fetchSearchMiniApps({ q, cursor = '' }) {
  return fetchNeynar(`frame/search?limit=30&q=${q}&cursor=${cursor}`).then(defaultMiniAppTransform)
}
const defaultMiniAppTransform = (response: any) => {
  return {
    items: response?.frames || [],
    nextPageParam: response?.next?.cursor || null,
  }
}

export function fetchMiniApp({ url }) {
  return fetchNeynar(`cast/embed/crawl/?url=${url}`).then((r) => r.metadata)
}
export function fetchUrlMetadata({ url }) {
  return fetchNeynar(`cast/embed/crawl/?url=${url}`).then((r) => r.metadata)
}

export function fetchUserCastMetrics({ fid }) {
  return fetchNeynar(`cast/metrics/?q=*&interval=180d&author_fid=${fid}`).then((r) => r.metrics?.reverse())
}
export function fetchChannelCastMetrics({ channelId }) {
  return fetchNeynar(`cast/metrics/?q=*&interval=180d&channel_id=${channelId}`).then((r) => r.metrics?.reverse())
}

export function fetchSearchCasts({ q, sort_type, author_fid = '', limit = 50, cursor = '' }) {
  const path = `cast/search?limit=${limit}&cursor=${cursor}&q=${q}&sort_type=${sort_type}&author_fid=${author_fid}`
  return fetchNeynar(path).then((r) => ({
    items: r.result?.casts || [],
    nextPageParam: r?.result?.next?.cursor || null,
  }))
}

export function fetchFirstCast({ fid }) {
  return fetchSearchCasts({ q: '*', sort_type: 'chron', author_fid: fid, limit: 1 }).then((r) => r.items[0])
}

export function fetchNotifications({ fid, limit = 25, cursor = '', priority = true, type = '' }) {
  const path = `notifications?fid=${fid}&priority_mode=${priority}&limit=${limit}&cursor=${cursor || ''}${type ? `&type=${type}` : ''}`
  return fetchNeynar(path).then(defaultNotificationsTransform)
}
const defaultNotificationsTransform = (response: any) => {
  return {
    items: response?.notifications || [],
    nextPageParam: response?.next?.cursor || null,
    unseen_notifications_count: response?.unseen_notifications_count,
  }
}
