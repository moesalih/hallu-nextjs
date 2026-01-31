import { supabase } from '@/lib/services/supabase-client'

export async function GET() {
  await fetchAndStoreDuneQuery('https://api.dune.com/api/v1/query/4028488/results?limit=1000', 'dau')
  await fetchAndStoreDuneQuery('https://api.dune.com/api/v1/query/3585165/results?limit=1000', 'daily_signups')
  return Response.json({ status: 'ok' })
}

function fetchAndStoreDuneQuery(queryUrl: string, dbKey: string) {
  return fetch(queryUrl, {
    method: 'GET',
    headers: {
      'x-dune-api-key': process.env.DUNE_API_KEY || '',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((response) => response?.result?.rows)
    .then(async (rows) => {
      const { error } = await supabase.from('farcaster_stats').upsert([
        {
          key: dbKey,
          value: JSON.stringify(rows),
          updated_at: new Date(),
        },
      ])
      console.log(`${dbKey} data`, rows?.length, error)
    })
}
