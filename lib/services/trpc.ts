import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/app/api/trpc/[trpc]/route'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
})

export async function fetchAllPosts() {
  return trpc.posts.query()
}

export async function fetchUserPosts(username: string) {
  return trpc.userPosts.query({ username })
}

export async function fetchUserByUsername(username: string) {
  return trpc.user.query({ username })
}
