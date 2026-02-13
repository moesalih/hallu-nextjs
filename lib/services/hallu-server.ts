import { dbQuery } from './cloudflare-d1'

export async function fetchAllPosts() {
  const rows = await dbQuery(
    `SELECT posts.*, users.username AS user_username
     FROM posts
     LEFT JOIN users ON users.id = posts.user_id
     ORDER BY posts.created_at DESC
     LIMIT 20`,
  )

  const data = rows.map(transformPostRow)
  return defaultPostFeedTransform(data)
}

export async function fetchUserPosts(username: string) {
  const rows = await dbQuery(
    `SELECT posts.*, users.username AS user_username
     FROM posts
     INNER JOIN users ON users.id = posts.user_id
     WHERE users.username = $1
     ORDER BY posts.created_at DESC
     LIMIT 100`,
    [username],
  )

  const data = rows.map(transformPostRow)
  return defaultPostFeedTransform(data)
}

function defaultPostFeedTransform(response: any) {
  return {
    items: response || [],
    nextPageParam: null,
  }
}

export async function fetchUserByUsername(username: string) {
  const rows = await dbQuery(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username])
  return rows[0] || null
}

function transformPostRow(row: any) {
  return {
    ...row,
    images: parseJsonArray(row.images),
    user: {
      username: row.user_username,
    },
  }
}

function parseJsonArray(value: any) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
