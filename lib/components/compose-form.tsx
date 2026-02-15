import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { usePost } from '@/app/p/[hash]/layout'
import { ImageIcon } from '@/lib/components/icons'
import { QuotedPost } from '@/lib/components/post'
import { Button, TextArea } from '@/lib/components/ui'
// import { supabase } from '@/lib/services/supabase-client'
import { useFetchNeynarWithAuth } from '@/lib/utils/farcaster'
import { formatDateFull } from '@/lib/utils/format'

export function ComposeForm({
  replyToCastHash,
  quoteCastHash,
  channelId,
  initialText,
  initialEmbeds,
  onPostSuccess,
}: {
  replyToCastHash?: string
  quoteCastHash?: string
  channelId?: string
  initialText?: string
  initialEmbeds?: string[]
  onPostSuccess?: () => void
}) {
  const fetchNeynarWithAuth = useFetchNeynarWithAuth()
  const [text, setText] = useState(initialText || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const { data: quotedPost } = usePost(quoteCastHash)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  async function onPost() {
    const initialUrlEmbeds = initialEmbeds?.map((url) => ({ url })) || []
    const mediaEmbeds = mediaUrls.map((url) => ({ url }))
    const castEmbeds = quotedPost ? [{ cast_id: { hash: quotedPost.hash, fid: quotedPost.author?.fid } }] : []
    const result = await fetchNeynarWithAuth('cast', 'POST', {
      text,
      parent: replyToCastHash ? replyToCastHash : undefined,
      channel_id: channelId,
      embeds: [...initialUrlEmbeds, ...mediaEmbeds, ...castEmbeds],
    })
    if (result) {
      toast.success('Posted')
      onPostSuccess?.()
      setText('')
      setMediaUrls([])
    } else {
      toast.error('Failed to post')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row">
        <div>{quoteCastHash ? 'Quote' : replyToCastHash ? 'Reply' : 'Compose'}</div>
        <Button className="ml-auto rounded-full!" onClick={onPost}>
          Post
        </Button>
      </div>

      {channelId && (
        <div className="px-2 py-1 bg-neutral-400/30 opacity-50  rounded-lg text-xs max-w-max break-all">
          /{channelId}
        </div>
      )}
      <TextArea
        ref={textareaRef}
        size="md"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={textAreaInputResizer}
        placeholder="Write something..."
        type="text"
        className="min-h-[100px] max-h-[200px] resize-none"
      />
      {(initialEmbeds?.length || mediaUrls.length > 0) && (
        <div className="flex flex-row flex-wrap">
          {initialEmbeds?.map((url) => (
            <div
              key={url}
              className="px-2 py-1 bg-neutral-400/30 opacity-50 rounded-lg text-xs max-w-max break-all mr-2 mb-2"
            >
              {url}
            </div>
          ))}
          {mediaUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt="media"
              className="max-w-20 max-h-20 mr-2 rounded-lg border border-neutral-400/15"
            />
          ))}
        </div>
      )}
      {quoteCastHash && quotedPost && <QuotedPost cast={quotedPost} />}
      <div className="flex flex-row p-2 rounded-xl bg-neutral-400/15  ">
        <MediaButton onMediaSelected={(mediaUrls) => setMediaUrls(mediaUrls)} />
      </div>
    </div>
  )
}

function textAreaInputResizer(e: React.FormEvent<HTMLTextAreaElement>) {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

function MediaButton({ onMediaSelected }: { onMediaSelected: (mediaUrls: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onButtonClick() {
    fileInputRef.current?.click()
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const uploadedUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = await uploadFile(file)
      if (url) uploadedUrls.push(url)
    }
    onMediaSelected(uploadedUrls)
  }

  return (
    <div>
      <ImageIcon className="size-4 m-1 opacity-50 cursor-pointer" onClick={onButtonClick}>
        Add Media
      </ImageIcon>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*,video/*"
        onChange={onFilesSelected}
      />
    </div>
  )
}

async function uploadFile(file) {
  const path = ('' + formatDateFull(new Date()) + '_' + file.name).replace(/\s+/g, '_')
  // const { data, error } = await supabase.storage.from('cast_embeds').upload(path, file)
  // if (error) {
  //   console.error('Error uploading file:', error)
  //   return null
  // } else {
  //   return supabase.storage.from('cast_embeds').getPublicUrl(data.path).data.publicUrl
  // }
  return null
}
