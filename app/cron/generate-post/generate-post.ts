import { createImage, createText } from '@/lib/services/ai'
import { uploadFile } from '@/lib/services/supabase-client'
import { dbQuery } from '@/lib/services/supabase-server'

// Randomization pools for variety
const ACTIVITY_MOMENTS = [
  'morning routine',
  'evening wind-down',
  'current activity in progress',
  'recent achievement or milestone',
  'trying something new',
  'practice session',
  'preparation or setup',
  'break or pause moment',
  'focused work time',
  'spontaneous moment',
  'planned activity',
  'before starting',
  'after finishing',
  'progress check-in',
  'experimental attempt',
]

const PERSPECTIVES = [
  'behind the scenes',
  'the final result',
  'work in progress',
  'close-up detail',
  'full scene overview',
  'over-the-shoulder view',
  'first-person perspective',
  'candid snapshot',
  'staged composition',
  'action shot',
  'before and after concept',
  'process documentation',
  'environment/setting focus',
]

const MOODS = [
  'excited',
  'thoughtful',
  'humorous',
  'nostalgic',
  'curious',
  'playful',
  'reflective',
  'energetic',
  'calm',
  'amazed',
  'determined',
  'grateful',
  'creative',
  'adventurous',
  'cozy',
]

const STYLES = [
  'vibrant and colorful',
  'minimalist and clean',
  'artistic and abstract',
  'realistic and detailed',
  'whimsical and fun',
  'moody and atmospheric',
  'bright and cheerful',
  'cinematic',
  'sketch-like',
  'bold and graphic',
  'soft and dreamy',
  'dramatic lighting',
  'candid and natural',
]

const CONTENT_TYPES = [
  'sharing a personal moment',
  'asking a thought-provoking question',
  'telling a brief story',
  'sharing an observation',
  'expressing an opinion',
  'describing an experience',
  'sharing a discovery',
  'celebrating something',
  'reflecting on something',
  'sharing a tip or insight',
]

const userToPostPrompt = `You are creating an image generation prompt for a social media post.

Your task: Generate ONE specific, detailed image prompt that will be passed to an image generation AI.

Guidelines:
- Be highly specific and visual in your description
- Include concrete details about the scene, lighting, composition, and atmosphere
- Make it unique and creative - avoid generic or overused concepts
- The prompt should be clear enough for an image AI to render accurately
- Keep it focused on a single, coherent scene or moment
- Avoid text in the image

Return ONLY the image generation prompt, nothing else.`

const postPromptToCaption = `You are writing a social media caption for an image post.

Your task: Create ONE authentic, engaging caption that matches the image description.

Guidelines:
- Write in first person, as if the user is posting
- Keep it natural and conversational (not overly polished or promotional)
- Match the specified mood and content type
- Be specific to THIS particular image/moment
- Length: 1-3 sentences typically, can be shorter or longer if it fits
- Don't use hashtags unless they feel truly organic

Return ONLY the caption text, nothing else.`

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getTemporalContext(): string {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })
  const month = now.toLocaleDateString('en-US', { month: 'long' })

  let timeOfDay = 'day'
  if (hour < 6) timeOfDay = 'late night'
  else if (hour < 12) timeOfDay = 'morning'
  else if (hour < 17) timeOfDay = 'afternoon'
  else if (hour < 21) timeOfDay = 'evening'
  else timeOfDay = 'night'

  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday'

  return `It's ${timeOfDay} on a ${isWeekend ? 'weekend' : 'weekday'} ${dayOfWeek} in ${month}.`
}

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

export interface GeneratePostResult {
  user: any
  postPrompt: string
  url?: string
  caption?: string
  post?: any
  variety: {
    activityMoment: string
    perspective: string
    mood: string
    // style: string
    contentType: string
    temporal: string
  }
  error?: string
}

export async function generatePost(): Promise<GeneratePostResult> {
  const user = await getRandomUserWithPrompt()
  if (!user) {
    throw new Error('No users with prompts found')
  }

  // Generate variety elements
  const activityMoment = getRandomElement(ACTIVITY_MOMENTS)
  const perspective = getRandomElement(PERSPECTIVES)
  const mood = getRandomElement(MOODS)
  // const style = getRandomElement(STYLES)
  const contentType = getRandomElement(CONTENT_TYPES)
  const temporal = getTemporalContext()
  const randomSeed = Math.random().toString(36).substring(2, 8)

  // Build enhanced prompt with variety
  const enhancedUserPrompt = `${userToPostPrompt}

User description: ${user.prompt}

VARIETY REQUIREMENTS (randomization seed: ${randomSeed}):
- Activity/Moment: ${activityMoment}
- Visual perspective: ${perspective}
- Mood/tone: ${mood}
- Content type: ${contentType}
- Context: ${temporal}

IMPORTANT: Stay true to the user's profile/interests. Create a post that fits their description while incorporating the variety elements above in a natural way. Make it completely unique - avoid generic or repetitive ideas.`

  const postPrompt = await createText(enhancedUserPrompt, 1.2)
  const url = await generateAndUploadImage(postPrompt)

  if (!url) {
    return {
      user,
      postPrompt,
      variety: { activityMoment, perspective, mood, contentType, temporal },
      error: 'Failed to generate image',
    }
  }

  const enhancedCaptionPrompt = `${postPromptToCaption}

Image prompt: ${postPrompt}

Write the caption with a ${mood} tone, ${contentType}. Make it authentic and specific to this particular moment/image.`

  const caption = await createText(enhancedCaptionPrompt, 1.1)

  // Create the post in the database
  const [post] = await dbQuery(`INSERT INTO posts (user_id, text, images) VALUES ($1, $2, $3) RETURNING *`, [
    user.id,
    caption,
    [url],
  ])

  return {
    user,
    postPrompt,
    url,
    caption,
    post,
    variety: { activityMoment, perspective, mood, contentType, temporal },
  }
}
