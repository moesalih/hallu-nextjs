import { homeImage, profileImage } from '@/lib/image'
import { fetchChannel } from '@/lib/services/neynar'

export { contentType, size } from '@/lib/image'

export default async function Image({ params }) {
  const { channelId } = await params
  return await channelImage(channelId)
}

export async function channelImage(channelId: string) {
  const channel = await fetchChannel({ channelId })
  if (!channel) return await homeImage()
  return await profileImage(channel?.id, channel?.image_url)
}
