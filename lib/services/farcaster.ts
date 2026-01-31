import { fetchUsersById, fetchUsersFeed } from '@/lib/services/neynar'
import { fetchDirectOrProxyJSON } from '@/lib/utils/fetch'

export async function fetchStarterPack(id: string | undefined) {
  if (!id) return null
  return await fetchDirectOrProxyJSON(`https://client.farcaster.xyz/v2/starter-pack?id=${id}`).then(
    (r) => r?.result?.starterPack
  )
}

export function fetchStarterPackMemberIds(id: string) {
  return fetchDirectOrProxyJSON(`https://api.farcaster.xyz/fc/starter-pack-members?id=${id}`).then(
    (data) => data?.result?.members
  )
}

export function fetchTrendingUsersIds() {
  return fetchDirectOrProxyJSON(`https://api.farcaster.xyz/v1/creator-rewards-winner-history?limit=100`)
    .then((data) => data?.result?.history?.winners)
    .then((users) => users.map((u) => u.fid))
}

export function fetchTrendingUsers() {
  return fetchTrendingUsersIds().then((fids) => fetchUsersById({ fids: fids.join(',') }))
}

export function fetchTrendingUsersFeed(cursor: string = '') {
  return fetchTrendingUsersIds().then((fids) => fetchUsersFeed({ fids: fids.join(','), cursor }))
}
