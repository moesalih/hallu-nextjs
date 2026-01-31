import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
)

export async function sendAnalyticsEvent(payload: { event: string; param?: string; fid?: number; platform?: string }) {
  try {
    // console.log('📈', payload)
    const { data, error } = await supabase.from('analytics_events').insert([payload])
    if (error) throw error
    return data
  } catch (error) {
    console.error('sendAnalyticsEvent error:', error)
  }
}

export async function uploadFile(bucketId, path, file) {
  const { data, error } = await supabase.storage.from(bucketId).upload(path, file)
  if (error) {
    console.error('Error uploading file:', error)
    return null
  } else {
    return supabase.storage.from(bucketId).getPublicUrl(data.path).data.publicUrl
  }
}
