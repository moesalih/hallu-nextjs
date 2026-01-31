import { createImage } from '@/lib/services/ai'
import { uploadFile } from '@/lib/services/supabase-client'
import { dbQuery } from '@/lib/services/supabase-server'

async function getRandomUserWithPrompt() {
  const result = await dbQuery(`
    SELECT id, username, prompt FROM users 
    WHERE prompt IS NOT NULL AND prompt != '' 
    ORDER BY RANDOM() 
    LIMIT 1
  `)
  return result[0] || null
}

async function generateAndUploadImage(prompt: string): Promise<string | null> {
  try {
    const base64 = await createImage(prompt)
    const imageBuffer = Buffer.from(base64, 'base64')

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    const filename = `generated/${timestamp}-${randomId}.png`
    const bucketId = 'post_attachments'

    // Upload to Supabase storage
    const publicUrl = await uploadFile(bucketId, filename, imageBuffer)
    return publicUrl
  } catch (error) {
    console.error('generateAndUploadImage error:', error)
    return null
  }
}

export async function GET(request: Request) {
  console.log(request.url)
  const user = await getRandomUserWithPrompt()
  if (!user) return Response.json({ error: 'No users with prompts found' }, { status: 404 })

  const url = await generateAndUploadImage(user.prompt)
  if (!url) return Response.json({ error: 'Failed to generate image' }, { status: 500 })

  return Response.json({ url, user })
}
