import { dbQuery } from '@/lib/services/cloudflare-d1'

const sqlCreateTableAnalyticsEvents = `CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f+00', CURRENT_TIMESTAMP)),
  event TEXT NOT NULL,
  param TEXT,
  fid INTEGER,
  platform TEXT
)`

export async function GET(request: Request) {
  const result = await dbQuery({ sql: sqlCreateTableAnalyticsEvents })
  return Response.json({ result })
}
