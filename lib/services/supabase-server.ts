import postgres from 'postgres'

const sql = postgres(process.env.SUPABASE_POSTGRES || '')

export async function dbQuery(query: string, args: any[] = []) {
  const result = await sql.unsafe(query, args)
  return result
}
