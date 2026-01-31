import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function createImage(prompt: string) {
  const { files } = await generateText({
    model: google('gemini-3-pro-image-preview'),
    prompt: prompt,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: { aspectRatio: '1:1' },
      },
    },
  })

  if (!files || files.length === 0) {
    throw new Error('No image generated')
  }

  return files[0].base64
}
