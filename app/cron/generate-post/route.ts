import { createImage, createText } from '@/lib/services/ai'
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
  const user = await getRandomUserWithPrompt()
  if (!user) return Response.json({ error: 'No users with prompts found' }, { status: 404 })

  const postPrompt = await createText(`${userToPostPrompt}${user.prompt}`)
  const url = await generateAndUploadImage(postPrompt)
  if (!url) return Response.json({ user, postPrompt, error: 'Failed to generate image' }, { status: 500 })

  const caption = await createText(`${postPromptToCaption}${postPrompt}`)

  // Create the post in the database
  const [post] = await dbQuery(`INSERT INTO posts (user_id, text, images) VALUES ($1, $2, $3) RETURNING *`, [
    user.id,
    caption,
    [url],
  ])

  return Response.json({ user, postPrompt, url, caption, post })
}

const userToPostPrompt = `create a prompt for an example image post for a user with the following description, this generated prompt will be passed to an image generation model so make is clear. just a single option. the output needs to be randomized so that every time this is run it produces a different post, resulting in a nice varied user feed: ------\n\n`
const postPromptToCaption = `create a caption for the following image post prompt, single option. just return the caption. the output will be posted directly: ------\n\n`
