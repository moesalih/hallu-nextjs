import { AwsClient } from 'aws4fetch'

const R2_PUBLIC_URL = 'https://pub-0e517429b0af4690824dd1c28dc67723.r2.dev'
const R2_BUCKET_NAME = 'hallu-post-attachments'

const r2 = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
})

function r2Url(key: string) {
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`
}

export async function uploadToR2(key: string, body: Buffer): Promise<string | null> {
  try {
    const uint8 = new Uint8Array(body)
    const res = await r2.fetch(r2Url(key), {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png', 'Content-Length': uint8.byteLength.toString() },
      body: uint8,
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('R2 upload error:', res.status, text)
      return null
    }
    return `${R2_PUBLIC_URL}/${key}`
  } catch (error) {
    console.error('R2 upload error:', error)
    return null
  }
}

export async function deleteFromR2(keys: string[]): Promise<void> {
  if (keys.length === 0) return
  await Promise.all(
    keys.map(async (key) => {
      const res = await r2.fetch(r2Url(key), { method: 'DELETE' })
      if (!res.ok) {
        const text = await res.text()
        console.error('R2 delete error:', res.status, text)
      }
    }),
  )
}
