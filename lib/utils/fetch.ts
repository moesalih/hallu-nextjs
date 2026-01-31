export async function fetchDirectJSON(url: string, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (url.startsWith('https://api.neynar.com')) {
    headers['x-api-key'] = process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
    headers['x-neynar-experimental'] = 'true'
  }
  // console.log('fetchDirectJSON', url, method, body, headers)
  const options = { method, headers, body: body ? JSON.stringify(body) : null }
  return await fetch(url, options).then((res) => res.json())
}

export async function fetchProxyJSON(url: string, method = 'GET', body = null) {
  const baseUrl = '/proxy?path='
  const headers = { 'Content-Type': 'application/json' }
  // console.log('fetchProxyJSON', url)
  const options = { method, headers, body: body ? JSON.stringify(body) : null }
  return await fetch(baseUrl + encodeURIComponent(url), options).then((res) => res.json())
}

export async function fetchDirectOrProxyJSON(url: string, method = 'GET', body = null) {
  if (global?.window) return await fetchProxyJSON(url, method, body) // in browser, use proxy
  else return await fetchDirectJSON(url, method, body) // in server, fetch directly
}
