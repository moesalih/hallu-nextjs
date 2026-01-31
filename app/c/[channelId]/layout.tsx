import type { Metadata } from 'next'
import { appUrl, generateMetadataFromProps } from '@/lib/metadata'

import Layout from './layout-client'
export default Layout

export async function generateMetadata({ params }): Promise<Metadata> {
  const { channelId } = await params
  return generateMetadataFromProps({ image: `${appUrl}/c/${channelId}/opengraph-image` })
}
