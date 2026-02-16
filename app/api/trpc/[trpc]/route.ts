import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { fetchAllPosts, fetchUserByUsername, fetchUserPosts } from '@/lib/services/db'

const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return { greeting: `Hello, ${input.name}!` }
  }),
  posts: t.procedure.query(async () => {
    return await fetchAllPosts()
  }),
  userPosts: t.procedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    return await fetchUserPosts(input)
  }),
  user: t.procedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    return await fetchUserByUsername(input)
  }),
})

export type AppRouter = typeof appRouter

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
