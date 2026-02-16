import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appTRPCRouter } from '@/lib/services/trpc-server'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appTRPCRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
