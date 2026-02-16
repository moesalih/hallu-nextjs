import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from '@/app/api/trpc/[trpc]/route'

const trpc = createTRPCProxyClient<AppRouter>({ links: [httpLink({ url: '/api/trpc' })] })

export const fetchAllPosts = trpc.posts.query
export const fetchUserPosts = trpc.userPosts.query
export const fetchUserByUsername = trpc.user.query
