import type { Metadata, Viewport } from 'next'

import { Providers } from '@/app/providers'
import { appUrl, generateMetadataFromProps } from '@/lib/metadata'

import { fontClass } from './fonts'
import './globals.css'
import Layout from './layout-client'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromProps({ image: `${appUrl}/opengraph-image` })
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontClass} bg-white text-black dark:bg-black dark:text-white`}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
