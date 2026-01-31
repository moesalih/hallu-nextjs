import fcsdk from '@farcaster/miniapp-sdk'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { EllipsisIcon, LikeIcon, ReplyIcon, RepostIcon } from '@/lib/components/icons'
import { useAuth } from '@/lib/providers/auth-provider'
import { useFetchNeynarWithAuth } from '@/lib/utils/farcaster'
import { formatNumber } from '@/lib/utils/format'
import { haptics } from '@/lib/utils/haptics'

import { AccountSheet } from './account-sheet'
import { ComposeSheet } from './compose-sheet'
import { Menu } from './sheets'

export function PostInteractions({ cast, display = 'default' }) {
  const auth = useAuth()

  const hideInteractions = ['quote', 'sub-comment', 'preview'].includes(display)
  if (!cast || hideInteractions) return null

  const fetchNeynarWithAuth = useFetchNeynarWithAuth()
  const viewOnFc = () => fcsdk?.actions?.viewCast({ hash: cast.hash })
  const viewOnFcOrFetchNeynar = auth?.farcasterMiniApp?.context ? viewOnFc : fetchNeynarWithAuth

  return (
    <div className="flex flex-row items-center gap-5 ">
      <ReplyButton cast={cast} />
      <PostInteractionButton
        Icon={RepostIcon}
        color="text-green-400"
        count={cast?.reactions?.recasts_count}
        active={cast?.viewer_context?.recasted}
        onPress={() => viewOnFcOrFetchNeynar('reaction', 'POST', { reaction_type: 'recast', target: cast.hash })}
      />
      <PostInteractionButton
        Icon={LikeIcon}
        color="text-red-400 fill-red-400"
        count={cast?.reactions?.likes_count}
        active={cast?.viewer_context?.liked}
        onPress={() => viewOnFcOrFetchNeynar('reaction', 'POST', { reaction_type: 'like', target: cast.hash })}
      />
      <PostMoreMenu cast={cast} />
    </div>
  )
}

function ReplyButton({ cast }) {
  const auth = useAuth()
  const [showSheet, setShowSheet] = useState(false)
  // if (!auth?.writeAuthenticated) return null
  const viewOnFc = () => fcsdk?.actions?.viewCast({ hash: cast.hash })
  const onPress = auth?.farcasterMiniApp?.context ? viewOnFc : () => setShowSheet(true)
  return (
    <div>
      <PostInteractionButton Icon={ReplyIcon} count={cast?.replies?.count} onPress={onPress} />
      <ComposeSheet showSheet={showSheet} setShowSheet={setShowSheet} replyToCastHash={cast.hash} />
    </div>
  )
}

export function PostMoreMenu({ cast }) {
  const router = useRouter()
  const auth = useAuth()
  const [showMoreSheet, setShowMoreSheet] = useState(false)

  const onPress = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMoreSheet(true)
  }

  const fetchNeynarWithAuth = useFetchNeynarWithAuth()
  const viewOnFc = () => fcsdk?.actions?.viewCast({ hash: cast.hash })
  const viewOnFcOrFetchNeynar = auth?.farcasterMiniApp?.context ? viewOnFc : fetchNeynarWithAuth

  const onQuote = auth?.farcasterMiniApp?.context ? viewOnFc : () => router.push(`/compose?quoteCastHash=${cast.hash}`)
  const onDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    const result = await viewOnFcOrFetchNeynar('cast', 'DELETE', { target_hash: cast.hash })
    if (result) {
      toast.success('Post deleted')
    }
  }

  const menuOptions = [
    { title: 'Quote', onClick: onQuote },
    auth?.writeAuthenticated && cast.author.fid === auth.userFid && { title: 'Delete Post', onClick: onDeletePost },
  ]
  return (
    <>
      <EllipsisIcon className="size-4 cursor-pointer text-neutral-500" onClick={onPress} />
      <Menu menuOptions={menuOptions} showSheet={showMoreSheet} setShowSheet={setShowMoreSheet} />
    </>
  )
}

function PostInteractionButton({ Icon, color = 'text-neutral-500', count, active = false, onPress }) {
  const auth = useAuth()
  const [showAccountSheet, setShowAccountSheet] = useState(false)
  const [activeState, setActiveState] = useState(active)
  const [countState, setCountState] = useState(count)

  const onPress_ = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!auth?.writeAuthenticated && !auth?.farcasterMiniApp?.context) {
      setShowAccountSheet(true)
      return
    }
    if (!onPress) return
    if (activeState) return
    haptics()
    const result = await onPress()
    if (result) {
      const isActive = !activeState
      setActiveState(isActive)
      setCountState((prev) => prev + (isActive ? 1 : -1))
      haptics()
    }
  }
  const activeClass = activeState ? color : 'text-neutral-500'
  return (
    <div>
      <div className={'flex flex-row items-center gap-2 p-0.5 cursor-pointer ' + activeClass} onClick={onPress_}>
        <Icon className={'size-4 ' + activeClass} />
        <div className="text-xs">{formatNumber(countState)}</div>
      </div>
      <AccountSheet showSheet={showAccountSheet} setShowSheet={setShowAccountSheet} />
    </div>
  )
}
