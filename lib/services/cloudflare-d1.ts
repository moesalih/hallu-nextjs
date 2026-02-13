import { fetchDirectOrProxyJSON } from '@/lib/utils/fetch'

const baseUrl = 'https://api.cloudflare.com/client/v4'

function getD1RawUrl() {
  const accountId = process.env.D1_ACCOUNT_ID || ''
  const databaseId = process.env.D1_DATABASE_ID || ''

  if (!accountId || !databaseId) {
    throw new Error('Missing D1_ACCOUNT_ID or D1_DATABASE_ID')
  }

  return `${baseUrl}/accounts/${accountId}/d1/database/${databaseId}/query`
}

function toD1SqlAndParams(query: string, args: any[] = []) {
  const refs = [...query.matchAll(/\$(\d+)/g)]

  if (refs.length === 0) {
    return { sql: query, params: args }
  }

  const params = refs.map((match) => {
    const position = Number(match[1]) - 1
    return args[position]
  })

  const sql = query.replace(/\$(\d+)/g, '?')

  return { sql, params }
}

function normalizeD1Rows(response: any) {
  const statementResult = Array.isArray(response?.result) ? response.result[0] : response?.result || response

  const resultPayload = statementResult?.results || response?.results || null
  let rows = resultPayload

  const count =
    statementResult?.meta?.changes ??
    statementResult?.changes ??
    response?.meta?.changes ??
    response?.changes ??
    (Array.isArray(rows) ? rows.length : 0)

  const normalizedRows = rows
  ;(normalizedRows as any).count = count

  return normalizedRows
}

export async function dbQuery(query: string, args: any[] = []) {
  const { sql, params } = toD1SqlAndParams(query, args)

  const response = await fetchDirectOrProxyJSON(getD1RawUrl(), 'POST', {
    sql,
    params,
  })

  return normalizeD1Rows(response)
}
