import { dbQuery } from './cloudflare-d1'

export async function fetchAllPosts() {
  return await dbQuery(
    `SELECT posts.*, users.username AS user_username
     FROM posts
     LEFT JOIN users ON users.id = posts.user_id
     ORDER BY posts.created_at DESC
     LIMIT 20`,
  ).then(defaultPostFeedTransform)
}

export async function fetchUserPosts(username: string) {
  return await dbQuery(
    `SELECT posts.*, users.username AS user_username
     FROM posts
     INNER JOIN users ON users.id = posts.user_id
     WHERE users.username = $1
     ORDER BY posts.created_at DESC
     LIMIT 20`,
    [username],
  ).then(defaultPostFeedTransform)
}

export async function fetchUserByUsername(username: string) {
  const rows = await dbQuery(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username])
  return rows[0] || null
}

function defaultPostFeedTransform(response: any) {
  return {
    items: response?.map(transformPostRow) || [],
    nextPageParam: null,
  }
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
