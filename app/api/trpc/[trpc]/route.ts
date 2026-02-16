import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { TRPCError, initTRPC } from '@trpc/server'
import { z } from 'zod'

import { uploadToR2 } from '@/lib/services/cloudflare-r2'
import { fetchAllPosts, fetchUserByUsername, fetchUserPosts } from '@/lib/services/db'

const t = initTRPC.create()

export const appRouter = t.router({
  uploadFile: t.procedure.input(z.instanceof(FormData)).mutation(async ({ input }) => {
    const filename = input.get('filename')
    const file = input.get('file')
    if (typeof filename !== 'string' || !(file instanceof File)) throw 'Invalid upload payload'

    const body = Buffer.from(await file.arrayBuffer())
    const url = await uploadToR2(filename, body)
    if (!url) throw 'Failed to upload file'
    return { url }
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
