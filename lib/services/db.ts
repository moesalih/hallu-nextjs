import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { int, QueryBuilder, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { dbQuery } from '@/lib/services/cloudflare-d1'

const defaultCreatedAt = sql`strftime('%Y-%m-%d %H:%M:%f+00', CURRENT_TIMESTAMP)`

const users = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  created_at: text('created_at').notNull().default(defaultCreatedAt),
  username: text('username'),
  prompt: text('prompt'),
})

const posts = sqliteTable('posts', {
  id: text('id')
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  created_at: text('created_at').notNull().default(defaultCreatedAt),
  user_id: int('user_id')
    .notNull()
    .references(() => users.id),
  text: text('text'),
  images: text('images'),
})

const qb = new QueryBuilder()

//////////

type AnalyticsEvent = { event: string; param?: string; fid?: number; platform?: string }
export async function sendAnalyticsEvent({ event, param, fid, platform }: AnalyticsEvent) {
  return await dbQuery({
    sql: `INSERT INTO analytics_events (event, param, fid, platform) VALUES (?, ?, ?, ?)`,
    params: [event, param ?? null, fid ?? null, platform ?? null],
  })
}

const postsWithUsers = qb
  .select({
    ...getTableColumns(posts),
    user_username: sql`${users.username}`.as('user_username'),
  })
  .from(posts)
  .innerJoin(users, eq(users.id, posts.user_id))
  .orderBy(desc(posts.created_at))
  .limit(20)

export async function fetchAllPosts() {
  console.log('fetchAllPosts')
  return await dbQuery(postsWithUsers.toSQL()).then(postFeedTransform)
}

export async function fetchUserPosts({ username }: { username: string }) {
  return await dbQuery(postsWithUsers.where(eq(users.username, username)).toSQL()).then(postFeedTransform)
}

export async function fetchUserByUsername({ username }: { username: string }) {
  const rows = await dbQuery(qb.select().from(users).where(eq(users.username, username)).limit(1).toSQL())
  return rows[0] || null
}

function postFeedTransform(response: any) {
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
