import { generateText } from 'ai'
// import { google } from '@ai-sdk/google'

import { uploadToR2 } from './cloudflare-r2'

export async function createText(prompt: string, temperature: number = 1.0) {
  const { text } = await generateText({
    model: 'google/gemini-3-flash-preview',
    prompt: prompt,
    temperature: temperature,
  })

  return text
}

type CreateImageParams = {
  prompt: string
  imageUrl?: string
  model?: string
}

export async function createImage({ prompt, imageUrl, model }: CreateImageParams): Promise<string> {
  const { files, warnings } = await generateText({
    model: model || 'google/gemini-2.5-flash-image',
    // prompt: prompt,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          ...(imageUrl ? [{ type: 'image', image: new URL(imageUrl) } as const] : []),
        ],
      },
    ],
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    },
  })

  if (!files || files.length === 0) {
    console.error('createImage warnings:', warnings)
    throw new Error(`No image generated`)
  }

  return files[0].base64
}

export async function generateAndUploadImage({ prompt, imageUrl, model }: CreateImageParams): Promise<string | null> {
  try {
    const base64 = await createImage({ prompt, imageUrl, model })
    const imageBuffer = Buffer.from(base64, 'base64')

    const randomId = Math.random().toString(36).substring(2, 10)
    const filename = `${new Date().toISOString()}_${randomId}.png`

    const publicUrl = await uploadToR2(filename, imageBuffer)
    return publicUrl
  } catch (error) {
    console.error('generateAndUploadImage error:', error)
    return null
  }
}
