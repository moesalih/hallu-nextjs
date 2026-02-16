import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from '@/app/api/trpc/[trpc]/route'

const trpc = createTRPCProxyClient<AppRouter>({ links: [httpLink({ url: '/api/trpc' })] })

export async function uploadFile(file) {
  const filename = (new Date().toISOString() + '_' + file.name).replace(/\s+/g, '_')
  try {
    const formData = new FormData()
    formData.set('filename', filename)
    formData.set('file', file)

    const result = await trpc.uploadFile.mutate(formData)
    return result?.url ?? null
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

export const fetchAllPosts = trpc.posts.query
export const fetchUserPosts = trpc.userPosts.query
export const fetchUserByUsername = trpc.user.query
