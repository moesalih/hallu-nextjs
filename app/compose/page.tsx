'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { ComposeForm } from '@/lib/components/compose-form'
import { useAuth } from '@/lib/providers/auth-provider'

export default function Wrapper() {
  return (
    <Suspense>
      <ComposeScreen />
    </Suspense>
  )
}

function ComposeScreen() {
  const auth = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const replyToCastHash = searchParams.get('replyToCastHash') || undefined
  const quoteCastHash = searchParams.get('quoteCastHash') || undefined
  const channelId = searchParams.get('channelId') || undefined
  const text = searchParams.get('text') || undefined
  const embed = searchParams.get('embed') || undefined

  if (!auth?.userFid) return null

  return (
    <div className="p-4">
      <ComposeForm
        replyToCastHash={replyToCastHash}
        quoteCastHash={quoteCastHash}
        channelId={channelId}
        initialText={text}
        initialEmbeds={embed ? [embed] : undefined}
        onPostSuccess={() => {
          router.back()
        }}
      />
    </div>
  )
}
