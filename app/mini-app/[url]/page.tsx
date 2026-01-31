'use client'

import { useUrlMetadataFromParams } from '@/app/mini-app/[url]/layout'
import { MiniAppPreview } from '@/lib/components/post'
import { Debug } from '@/lib/components/ui'

export default function MiniAppEmbed() {
  const { data: urlMetadata } = useUrlMetadataFromParams()
  if (!urlMetadata) return null

  return (
    <div>
      <MiniAppPreview className="m-4" urlMetadata={urlMetadata} />
      <Debug title="Embed Metadata" className="m-4 mt-8" data={urlMetadata?.html?.fcFrame} />
    </div>
  )
}
