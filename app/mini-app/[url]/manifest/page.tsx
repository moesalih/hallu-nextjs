'use client'

import { useUrlMetadataFromParams } from '@/app/mini-app/[url]/layout'
import { Debug } from '@/lib/components/ui'

export default function MiniAppManifest() {
  const { data: urlMetadata } = useUrlMetadataFromParams()
  if (!urlMetadata) return null
  return <Debug title="" className="p-4" data={{ ...urlMetadata?.frame?.manifest, frame: undefined }} />
}
