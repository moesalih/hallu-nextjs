import { supabase } from './supabase-client'

export async function fetchAllPosts() {
  // Join users table using foreign key and include username
  const { data, error } = await supabase
    .from('posts')
    .select('*,user:users!user_id(username)')
    .order('created_at', { ascending: false })
  console.log('fetchAllPosts:', data, error)
  return defaultPostFeedTransform(data || [])
}

export async function fetchUserPosts(username: string) {
  // Join users table using foreign key and filter by username
  const { data, error } = await supabase
    .from('posts')
    .select('*,user:users!user_id(username)')
    .eq('users.username', username)
  console.log('fetchUserPosts:', data, error)
  return defaultPostFeedTransform(data || [])
}

function defaultPostFeedTransform(response: any) {
  return {
    items: response || [],
    nextPageParam: null,
  }
}
