'use client'

import { useParams } from 'next/navigation'

import { useUrlMetadataFromParams } from '@/app/mini-app/[url]/layout'
import { Debug } from '@/lib/components/ui'

export default function MiniAppDebug() {
  const { url } = useParams()
  const decodedUrl = decodeURIComponent(url as string)
  const { data: urlMetadata } = useUrlMetadataFromParams()
  if (!urlMetadata) return null
  return (
    <div>
      <Debug title="URL" className="m-4" data={decodedUrl} />
      <Debug title="Neynar Data" className="m-4" data={urlMetadata} />
    </div>
  )
}
