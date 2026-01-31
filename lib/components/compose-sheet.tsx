import { ComposeForm } from '@/lib/components/compose-form'
import { Sheet } from '@/lib/components/sheets'

export function ComposeSheet({
  showSheet,
  setShowSheet,
  replyToCastHash,
  channelId,
}: {
  showSheet: boolean
  setShowSheet: (show: boolean) => void
  replyToCastHash?: string
  channelId?: string
}) {
  return (
    <Sheet showSheet={showSheet} setShowSheet={setShowSheet} stopPropagation>
      <ComposeForm
        replyToCastHash={replyToCastHash}
        channelId={channelId}
        onPostSuccess={() => {
          setShowSheet(false)
        }}
      />
    </Sheet>
  )
}
