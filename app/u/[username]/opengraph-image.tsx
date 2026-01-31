import { homeImage, profileImage } from '@/lib/image'
import { fetchUser } from '@/lib/services/neynar'

export { contentType, size } from '@/lib/image'

export default async function Image({ params }) {
  const { username } = await params
  return await userImage(username)
}

export async function userImage(username: string) {
  const user = await fetchUser({ username })
  if (!user) return await homeImage()
  return await profileImage(user?.username, user?.pfp_url)
}
