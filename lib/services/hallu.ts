async function fetchHallu(path: string) {
  const res = await fetch(path)
  const json = await res.json()
  if (!res.ok || !json?.ok) throw new Error(json?.error || 'Failed to fetch hallu data')
  return json.data
}

export async function fetchAllPosts() {
  return fetchHallu('/api/hallu/posts')
}

export async function fetchUserPosts(username: string) {
  return fetchHallu(`/api/hallu/user-posts?username=${encodeURIComponent(username)}`)
}

export async function fetchUserByUsername(username: string) {
  return fetchHallu(`/api/hallu/user?username=${encodeURIComponent(username)}`)
}
