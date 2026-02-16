import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactPlayer from 'react-player'

import { ImagesIcon } from '@/lib/components/icons'
import { LinkedText } from '@/lib/components/LinkedText'
import { userDefaultImage } from '@/lib/components/misc'
import { PostInteractions } from '@/lib/components/post-interactions'
import { formatDateFull, formatDateRelative, trimString } from '@/lib/utils/format'

export function Post({ cast, display = 'default', hideSeparator = false }) {
  const router = useRouter()

  const viewProfile = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // fcsdk.actions.viewProfile({ fid: cast?.author?.fid })
    router.push(`/u/${cast?.user?.username}`)
  }
  const viewPost = (e) => {
    if (display == 'expanded') return
    e.preventDefault()
    e.stopPropagation()
    // router.push(`/p/${cast?.id}`)
    router.push(`/u/${cast?.user?.username}`)
  }

  return (
    <div className={'p-4  border-neutral-400/25 ' + (hideSeparator ? '' : 'border-b')} onClick={viewPost}>
      <PostHeader onPress={viewProfile} cast={cast} />
      <div className="flex flex-col gap-3  mt-3">
        {/* <PostTag cast={cast} display={display} /> */}
        <PostText cast={cast} display={display} />
        <PostMedia cast={cast} />
        {/* <PostEmbeds cast={cast} /> */}
        {/* <PostQuoteEmbed cast={cast} display={display} /> */}
        {/* <PostPostedFrom cast={cast} display={display} /> */}
        {/* <PostInteractions cast={cast} display={display} /> */}
      </div>
    </div>
  )
}

function PostHeader({ onPress, cast }) {
  return (
    <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={onPress}>
      <img className="size-8 rounded-full object-cover" src={userDefaultImage(cast?.user?.username)} />
      <div className="font-semibold">{cast?.user?.username}</div>
      <div className="text-sm opacity-50" title={formatDateFull(cast?.created_at)}>
        {formatDateRelative(cast?.created_at)}
      </div>
    </div>
  )
}

function PostTag({ cast, display = 'default' }) {
  const router = useRouter()
  if (!cast?.channel && !cast?.parent_url) return null

  const viewFeed = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (cast.channel?.id) router.push(`/c/${cast.channel?.id}`)
    else router.push(`/fip2/${encodeURIComponent(cast.parent_url)}`)
  }

  const shortenedParentUrl = display == 'expanded' ? cast.parent_url : trimString(cast.parent_url, 64)

  return (
    <div
      className="inline-block px-2 py-1 bg-neutral-400/30 opacity-50  rounded-lg text-xs max-w-max break-all cursor-pointer"
      onClick={viewFeed}
    >
      {cast.channel?.id ? `/${cast.channel?.id}` : shortenedParentUrl}
    </div>
  )
}

function PostText({ cast, display = 'default' }) {
  const textElement = (
    <div className="break-words wrap-break-word whitespace-pre-line">
      <LinkedText>{cast?.text?.trim()}</LinkedText>
    </div>
  )
  if (display == 'expanded') return textElement
  return (
    <LimitedHeightFade height={300} fadeHeight={100}>
      {textElement}
    </LimitedHeightFade>
  )
}

function PostMedia({ cast }) {
  const images = cast.images
  const videos = []

  const [selectedImage, setSelectedImage] = useState(null)

  if (!images?.length && !videos?.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {images?.length > 0 && (
        <div className="flex flex-row gap-1 flex-wrap items-start">
          {images.map((image, i) => (
            <div
              key={i}
              className={`rounded-lg overflow-hidden max-w-lg cursor-pointer ${
                images.length > 1 ? 'w-[48%]' : 'w-[100%]'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelectedImage(image)
              }}
            >
              <img src={image} />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 w-screen h-screen z-50 object-contain bg-black/90"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setSelectedImage(null)
          }}
        >
          <div className="w-full h-full">
            <img src={selectedImage} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* {videos?.map((m, i) => (
        <ReactPlayer
          key={i}
          src={m.url}
          controls
          width="100%"
          height="auto"
          className="w-full max-w-lg rounded-lg overflow-hidden"
        />
      ))} */}
    </div>
  )
}

function PostEmbeds({ cast }) {
  const router = useRouter()

  const frames = cast.embeds?.filter((embed) => !!embed?.metadata?.frame)
  const urls = cast.embeds?.filter((embed) => !!embed?.metadata?.html && !embed?.metadata?.frame)
  const other = cast.embeds?.filter(
    (embed) =>
      !embed?.metadata?.html &&
      !embed?.metadata?.frame &&
      !embed?.metadata?.image &&
      !embed?.metadata?.video &&
      !embed?.cast,
  )

  if (!frames?.length && !urls?.length && !other?.length) return null

  const gotoMiniApp = (e, url) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/mini-app/${encodeURIComponent(url)}`)
  }

  return (
    <div className="flex flex-col gap-2">
      {frames?.map((embed, i) => (
        <div key={i} onClick={(e) => gotoMiniApp(e, embed?.url)}>
          <MiniAppPreview urlMetadata={embed?.metadata} />
        </div>
        // <div key={i} className="border border-neutral-400/25 rounded-lg p-2">
        //   <div className="text-sm opacity-50 break-all">Mini App: {embed.url}</div>
        // </div>
      ))}
      {urls?.map((embed, i) => (
        <div key={i} className="border border-neutral-400/25 rounded-lg p-2">
          <div className="text-sm opacity-50 break-all">URL: {embed.url}</div>
        </div>
      ))}
      {other?.map((embed, i) => (
        <div key={i} className="border border-neutral-400/25 rounded-lg p-2">
          <div className="text-sm opacity-50 break-all">{embed.url}</div>
        </div>
      ))}
    </div>
  )
}

const PostQuoteEmbed = ({ cast, display = 'default' }) => {
  const hideInteractions = display == 'quote'
  if (hideInteractions) return null

  if (!cast.embeds?.length) return null
  const quotedPost = cast.embeds?.find((embed) => !!embed.cast)?.cast
  if (!quotedPost || !quotedPost.id) return null
  // console.log('quotedPost', quotedPost)

  return <QuotedPost cast={quotedPost} />
}

export function QuotedPost({ cast }) {
  return (
    <div className="border border-neutral-400/25 rounded-xl overflow-hidden">
      <LimitedHeightFade>
        <Post cast={cast} display="quote" hideSeparator />
      </LimitedHeightFade>
    </div>
  )
}

function PostPostedFrom({ cast, display = 'default' }) {
  if (display != 'expanded') return null
  if (!cast) return null

  return <div className="text-xs opacity-50">Posted from {cast?.app?.username}</div>
}

export function SmallMediaPost({ cast }) {
  const router = useRouter()
  // const [isFullscreen, setIsFullscreen] = useState(false)
  const images = cast.images
  if (!images || !images.length) return null

  const toggleFullscreen = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // setIsFullscreen(!isFullscreen)
    // router.push(`/p/${cast.id}`)
    router.push(`/u/${cast?.user?.username}`)
  }

  return (
    <div className="w-full relative">
      {images?.slice(0, 1)?.map((image) => (
        <img
          key={image}
          src={image}
          onClick={toggleFullscreen}
          className={`cursor-pointer ${
            false
              ? 'fixed inset-0 w-screen h-screen z-50 object-contain bg-black/90'
              : 'w-full aspect-square object-cover'
          }`}
        />
      ))}
      <div className="absolute  top-0 right-0 p-2">{images?.length > 1 && <ImagesIcon className="size-4  " />}</div>
    </div>
  )
}

export function MiniAppPreview({ urlMetadata, className = '' }) {
  const embed = urlMetadata?.html?.fcFrame
  if (!embed) return null
  return (
    <div className={'border border-neutral-400/25 rounded-lg overflow-hidden max-w-lg ' + (className || '')}>
      <img className="w-full" src={embed?.imageUrl}></img>
      <div className="text-center font-semibold bg-neutral-400/15 p-3">{embed?.button?.title}</div>
    </div>
  )
}

function LimitedHeightFade({ children, height = 200, fadeHeight = 40 }) {
  return (
    <div className="relative overflow-hidden" style={{ maxHeight: height }}>
      {children}
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: height }}>
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-white dark:to-black"
          style={{ height: fadeHeight }}
        />
      </div>
    </div>
  )
}
