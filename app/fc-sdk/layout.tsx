import type { Metadata } from 'next'
import { appUrl, generateMetadataFromProps } from '@/lib/metadata'

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

export async function generateMetadata({}): Promise<Metadata> {
  return generateMetadataFromProps({ image: `${appUrl}/fc-sdk/opengraph-image` })
}
