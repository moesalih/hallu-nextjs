export async function fetchDirectJSON(url: string, method = 'GET', body: any = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (url.startsWith('https://api.neynar.com')) {
    headers['x-api-key'] = process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
    headers['x-neynar-experimental'] = 'true'
  }
  if (url.startsWith('https://api.cloudflare.com/client/v4/accounts/') && url.includes('/d1/database/')) {
    headers['Authorization'] = `Bearer ${process.env.D1_API_TOKEN || ''}`
  }
  // console.log('fetchDirectJSON', url, method, body, headers)
  const options = { method, headers, body: body ? JSON.stringify(body) : null }
  return await fetch(url, options).then((res) => res.json())
}

export async function fetchProxyJSON(url: string, method = 'GET', body: any = null) {
  const baseUrl = '/proxy?path='
  const headers = { 'Content-Type': 'application/json' }
  // console.log('fetchProxyJSON', url)
  const options = { method, headers, body: body ? JSON.stringify(body) : null }
  return await fetch(baseUrl + encodeURIComponent(url), options).then((res) => res.json())
}

export async function fetchDirectOrProxyJSON(url: string, method = 'GET', body: any = null) {
  if (global?.window) return await fetchProxyJSON(url, method, body)
  else return await fetchDirectJSON(url, method, body) // in server, fetch directly
}
