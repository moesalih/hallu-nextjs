import { createText, generateAndUploadImage } from '@/lib/services/ai'
import { dbQuery } from '@/lib/services/cloudflare-d1'

// Randomization pools for variety
const ACTIVITY_MOMENTS = [
  'morning routine',
  'evening wind-down',
  'current activity in progress',
  'recent achievement or milestone',
  'trying something new',
  'practice session',
  // 'preparation or setup',
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
  'the final result',
  'work in progress',
  'close-up detail',
  'full scene overview',
  'over-the-shoulder view',
  'first-person perspective',
  'candid snapshot',
  'action shot',
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

Your task: Generate ONE simple, natural image prompt that will be passed to an image generation AI.

Guidelines:
- Describe the scene simply and naturally - like you're telling someone what you want to capture
- Focus on the subject and what's happening, not technical photography details
- Avoid jargon like "cinematic", "8k", "hyper-realistic", "shallow depth of field", etc.
- Keep it concise - 2-3 sentences maximum
- Make it feel authentic and spontaneous, not over-produced
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
  const month = now.getMonth()

  let timeOfDay = 'day'
  if (hour < 6) timeOfDay = 'late night'
  else if (hour < 12) timeOfDay = 'morning'
  else if (hour < 17) timeOfDay = 'afternoon'
  else if (hour < 21) timeOfDay = 'evening'
  else timeOfDay = 'night'

  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday'

  // Vague seasonal hints instead of specific month names
  let seasonalHint = ''
  if (month >= 2 && month <= 4) seasonalHint = 'spring '
  else if (month >= 5 && month <= 7) seasonalHint = 'summer '
  else if (month >= 8 && month <= 10) seasonalHint = 'autumn '
  else seasonalHint = 'winter '

  return `${timeOfDay} on a ${isWeekend ? 'weekend' : 'weekday'}, ${seasonalHint}`
}

export interface GeneratePostResult {
  user: any
  postPrompt: string
  url?: string
  caption?: string
  post?: any
  variety: {
    activityMoment: string
    // perspective: string
    mood: string
    // style: string
    contentType: string
    // temporal: string
  }
  error?: string
}

export async function generatePost(user: any): Promise<GeneratePostResult> {
  // Generate variety elements
  const activityMoment = getRandomElement(ACTIVITY_MOMENTS)
  // const perspective = getRandomElement(PERSPECTIVES)
  const mood = getRandomElement(MOODS)
  // const style = getRandomElement(STYLES)
  const contentType = getRandomElement(CONTENT_TYPES)
  // const temporal = getTemporalContext()
  const randomSeed = Math.random().toString(36).substring(2, 8)

  // Build enhanced prompt with variety
  const enhancedUserPrompt = `${userToPostPrompt}

User description: ${user.prompt}

Optional creative direction (use lightly if it fits naturally, otherwise ignore):
Consider a ${mood} moment related to "${activityMoment}".

CRITICAL: The user's description is what matters most. Only use the creative direction above if it enhances the authenticity. Don't force it. Make each image unique and true to the user's character.`

  const postPrompt = await createText(enhancedUserPrompt, 1.2)
  const url = await generateAndUploadImage(postPrompt)

  if (!url) {
    return {
      user,
      variety: { activityMoment, mood, contentType },
      postPrompt,
      error: 'Failed to generate image',
    }
  }

  const enhancedCaptionPrompt = `${postPromptToCaption}

Image prompt: ${postPrompt}

Write the caption with a ${mood} tone, ${contentType}. Make it short and authentic and specific to this particular moment/image.`

  const caption = await createText(enhancedCaptionPrompt, 1.1)

  // Create the post in the database
  const [post] = await dbQuery({
    sql: `INSERT INTO posts (user_id, text, images) VALUES ($1, $2, $3) RETURNING *`,
    params: [user.id, caption, JSON.stringify([url])],
  })

  return {
    user,
    variety: { activityMoment, mood, contentType },
    postPrompt,
    post,
  }
}
