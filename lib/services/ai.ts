import { generateText } from 'ai'
// import { google } from '@ai-sdk/google'

export async function createText(prompt: string, temperature: number = 1.0) {
  const { text } = await generateText({
    model: 'google/gemini-3-flash-preview',
    prompt: prompt,
    temperature: temperature,
  })

  return text
}

export async function createImage(prompt: string) {
  const { files, warnings } = await generateText({
    model: 'google/gemini-2.5-flash-image',
    prompt: prompt,
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
