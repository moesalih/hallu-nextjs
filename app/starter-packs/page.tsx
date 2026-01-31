'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { StarterPackIcon } from '@/lib/components/icons'
import { TitleHeader } from '@/lib/components/misc'
import { Button, Input, Section } from '@/lib/components/ui'
import { fetchStarterPack } from '@/lib/services/farcaster'

import { PackMembers } from '../starter-pack/[id]/layout-client'

export default function StarterPacksScreen() {
  return (
    <div>
      <TitleHeader
        Icon={StarterPackIcon}
        title="Starter Packs"
        shareText={`Check out Farcaster Starter Packs on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />
      <div className="flex flex-col gap-8 p-4 mb-8 ">
        <CuratedPacks />
        <VisitForm />
      </div>
    </div>
  )
}

function CuratedPacks() {
  const curatedPacks = [
    'independent-journalists-glnse9',
    'Celo-Builders-5maeci',
    'Monad-Builders-uxvvnz',
    'neynar-team-tyy4s5',
    'Base-core-team-nr4cai',
  ]
  return (
    <div className="flex flex-col gap-4">
      {curatedPacks.map((packId) => (
        <Link href={`/starter-pack/${packId}`} key={packId}>
          <PackCard packId={packId} />
        </Link>
      ))}
    </div>
  )
}

function PackCard({ packId }) {
  const { data: starterPack, isLoading } = useQuery({
    queryKey: ['pack', packId],
    queryFn: () => fetchStarterPack(packId),
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return null

  return (
    <Section className="flex flex-row items-center justify-between gap-4">
      <div>
        <div>
          <div className="text-2xl font-semibold">{starterPack?.name}</div>
          <div className="flex flex-row items-center gap-2 mt-2 mb-6">
            <div className="text-sm opacity-50">by</div>
            <img className="w-4 h-4 rounded-full object-cover" src={starterPack?.creator?.pfp?.url}></img>
            <div className="text-sm font-medium opacity-75">{starterPack?.creator?.username}</div>
          </div>
        </div>
        <PackMembers starterPack={starterPack} />
      </div>
    </Section>
  )
}

function VisitForm({}) {
  const router = useRouter()
  const [url, setUrl] = useState('')

  const onVisit = () => {
    const id = url?.split('/').pop()
    console.log('onVisit', url, id)
    router.push(`/starter-pack/${id}`)
  }

  return (
    <Section className="flex flex-col gap-4">
      <Input
        size="lg"
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Starter Pack URL"
        autoCapitalize="on"
        autoCorrect="on"
        type="text"
        value={url}
      />
      <Button size="lg" disabled={!url} onClick={onVisit}>
        View Starter Pack
      </Button>
    </Section>
  )
}
