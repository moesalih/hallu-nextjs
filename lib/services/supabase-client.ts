import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
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
