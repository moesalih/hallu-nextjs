import type { Metadata } from 'next'
import { appUrl, generateMetadataFromProps } from '@/lib/metadata'

import Layout from './layout-client'
export default Layout

export async function generateMetadata({ params }): Promise<Metadata> {
  const { username } = await params
  return generateMetadataFromProps({ image: `${appUrl}/u/${username}/opengraph-image` })
}
