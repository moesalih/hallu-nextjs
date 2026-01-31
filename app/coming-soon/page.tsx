'use client'

import { BrandIcon } from '@/lib/components/icons'
import { TitleHeader } from '@/lib/components/misc'
import { PaddedError } from '@/lib/components/ui'

export default function ComingSoonScreen() {
  return (
    <div>
      <TitleHeader Icon={BrandIcon} title="Sonar" shareText={`Check out Sonar.\n\n\n✴︎ mini app by @moe!\n`} />
      <PaddedError message="Coming soon!" />
    </div>
  )
}
