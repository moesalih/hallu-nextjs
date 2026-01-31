import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { EllipsisIcon } from '@/lib/components/icons'
import { Button, ShareButton } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { useFarcasterMiniApp } from '@/lib/utils/farcaster'

export function Sheet({ children, showSheet, setShowSheet, stopPropagation = false }: any) {
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  useEffect(() => {
    if (!showSheet) {
      setKeyboardOffset(0)
      return
    }

    const viewport = global?.window?.visualViewport
    if (!viewport) return

    const onResize = () => {
      const offset = global?.window?.innerHeight - viewport.height
      setKeyboardOffset(offset)
    }

    viewport.addEventListener('resize', onResize)
    return () => viewport.removeEventListener('resize', onResize)
  }, [showSheet])

  const onContainerClick = (e: any) => {
    e.stopPropagation()
    setShowSheet(false)
  }
  const onSheetClick = (e: any) => {
    if (stopPropagation) e.stopPropagation()
  }
  return (
    <>
      {showSheet && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-xs z-10 transition-opacity duration-300 starting:opacity-0"
          onClick={onContainerClick}
        >
          <div
            className="absolute bottom-0 left-0 w-full pb-[env(safe-area-inset-bottom)] animate-slide-up"
            style={{ bottom: keyboardOffset }}
          >
            <div className="max-w-2xl mx-auto">
              <div
                className="m-4 bg-white dark:bg-black border border-neutral-400/15 rounded-3xl"
                onClick={onSheetClick}
              >
                <div className="flex flex-col items-stretch gap-3  p-5">{children}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//////////

export function MoreMenuWithShare({ menuOptions, shareUrl, shareText }) {
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [showShareSheet, setShowShareSheet] = useState(false)

  const allMenuOptions = [
    ...(menuOptions || []), //
    shareText && { title: 'Share', onClick: () => setShowShareSheet(true) },
  ].filter(Boolean)

  if (allMenuOptions.length === 0) return null

  return (
    <>
      <EllipsisIcon className="size-5 m-1 cursor-pointer opacity-50" onClick={() => setShowMoreSheet(true)} />
      <Menu menuOptions={allMenuOptions} showSheet={showMoreSheet} setShowSheet={setShowMoreSheet} />
      <ShareMenu url={shareUrl} text={shareText} showSheet={showShareSheet} setShowSheet={setShowShareSheet} />
    </>
  )
}

// export function ShareButtonSheet({ url, text }) {
//   const [showSheet, setShowSheet] = useState(false)
//   return (
//     <>
//       <ShareButton onClick={() => setShowSheet(true)} />
//       <ShareMenu url={url} text={text} showSheet={showSheet} setShowSheet={setShowSheet} />
//     </>
//   )
// }

export function ShareMenu({ url, text, showSheet, setShowSheet }) {
  const router = useRouter()
  const auth = useAuth()

  const onShareInPost = () => {
    if (auth?.farcasterMiniApp?.context) {
      auth?.farcasterMiniApp?.fcsdk?.actions?.composeCast?.({ text: text, embeds: [url] })
    } else {
      router.push(`/compose?text=${encodeURIComponent(text)}&embed=${encodeURIComponent(url)}`)
    }
  }

  const menuOptions = [
    (auth?.farcasterMiniApp?.context || auth?.writeAuthenticated) && { title: 'Share in Post', onClick: onShareInPost },
    { title: 'Copy Link', onClick: () => navigator.clipboard.writeText(url) },
  ].filter(Boolean) as { title: string; onClick: () => void }[]

  return <Menu title={url} menuOptions={menuOptions} showSheet={showSheet} setShowSheet={setShowSheet} />
}

export function Menu({ title = '', menuOptions, showSheet, setShowSheet }) {
  return (
    <>
      <Sheet showSheet={showSheet} setShowSheet={setShowSheet}>
        {title && <div className="text-lg font-medium text-center break-words my-4">{title}</div>}
        {menuOptions.filter(Boolean).map(({ title, onClick }) => (
          <Button key={title} size="lg" className="w-full" onClick={onClick}>
            {title}
          </Button>
        ))}
      </Sheet>
    </>
  )
}
