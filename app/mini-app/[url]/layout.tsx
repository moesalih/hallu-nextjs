'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { DebugIcon, EmbedIcon, ManifestIcon } from '@/lib/components/icons'
import { Header, NavOutlet } from '@/lib/components/misc'
import { PaddedError, PaddedSpinner } from '@/lib/components/ui'
import { fetchUrlMetadata } from '@/lib/services/neynar'

export default function MiniAppScreen({ children }: { children: React.ReactNode }) {
  const { data: urlMetadata, isLoading } = useUrlMetadataFromParams()

  if (isLoading) return <PaddedSpinner />
  if (!urlMetadata) return <PaddedError message="Mini app not found" />

  const author = urlMetadata.frame?.author

  return (
    <div>
      <Header shareText={`Check out this mini app on Sonar.\n\n\n✴︎ mini app by @moe!\n`}>
        <div className="flex flex-row items-center gap-3 ">
          <img className="size-12 rounded-xl object-cover" src={urlMetadata.frame?.manifest?.frame?.icon_url}></img>
          <div className="text-3xl font-semibold">{urlMetadata.frame?.manifest?.frame?.name}</div>
        </div>
        <div className="flex flex-row items-center gap-1 mt-2">
          <div className="text-xs opacity-50 ">By</div>
          <img src={author?.pfp_url} className="size-3 rounded-full"></img>
          <div className="text-xs font-medium opacity-50 truncate">{author?.username}</div>
        </div>
      </Header>
      <div className="mb-3"></div>

      <MiniAppNav />
      {children}
    </div>
  )
}

function MiniAppNav() {
  const { url } = useParams()
  const encodedUrl = url
  const navLinks = [
    { Icon: EmbedIcon, name: 'Embed', path: `/mini-app/${encodedUrl}` },
    { Icon: ManifestIcon, name: 'Manifest', path: `/mini-app/${encodedUrl}/manifest` },
    { Icon: DebugIcon, name: 'Debug', path: `/mini-app/${encodedUrl}/debug` },
  ]
  return <NavOutlet navLinks={navLinks} />
}

export function useUrlMetadataFromParams() {
  const { url } = useParams()
  const decodedUrl = decodeURIComponent(url as string)

  return useQuery({
    queryKey: ['url-metadata', decodedUrl],
    queryFn: () => fetchUrlMetadata({ url: decodedUrl as string }),
    staleTime: 1000 * 60 * 5,
  })
}
