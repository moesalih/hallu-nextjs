import { createImage } from '@/lib/services/ai'
import { uploadFile } from '@/lib/services/supabase-client'

const bucketId = 'post_attachments'

export async function generateAndUploadImage(prompt: string): Promise<string | null> {
  try {
    const base64 = await createImage(prompt)
    const imageBuffer = Buffer.from(base64, 'base64')

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    const filename = `generated/${timestamp}-${randomId}.png`

    // Upload to Supabase storage
    const publicUrl = await uploadFile(bucketId, filename, imageBuffer)
    return publicUrl
  } catch (error) {
    console.error('generateAndUploadImage error:', error)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get('prompt') || 'a cute robot painting a sunset'

  const url = await generateAndUploadImage(prompt)

  if (!url) {
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ url }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
