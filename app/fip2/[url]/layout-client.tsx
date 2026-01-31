'use client'

import { useParams } from 'next/navigation'

import { Header } from '@/lib/components/misc'
import { PaddedError } from '@/lib/components/ui'

export default function Fip2Screen({ children }: { children: React.ReactNode }) {
  const url = useUrlFromParams()

  if (!url) return <PaddedError message="URL not found" />

  const shareText = `Check out posts about ${url} on Sonar!\n\n\n✴︎ mini app by @moe`
  return (
    <div>
      <Header shareText={shareText}>
        <div className="text-3xl font-semibold break-all">{url}</div>
      </Header>
      {children}
    </div>
  )
}

export function useUrlFromParams() {
  const { url } = useParams()
  const decodedUrl = decodeURIComponent(url as string)

  return decodedUrl
}
