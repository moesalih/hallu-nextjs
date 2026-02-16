import { appName } from '@/lib/metadata'
import { dbQuery } from '@/lib/services/cloudflare-d1'

export default async function AnalyticsPage({ searchParams }) {
  const { p, c } = await searchParams
  const period = p || 'week'
  const countOn = c || 'distinct fid'
  return <Dashboard period={period} countOn={countOn} />
}

async function Dashboard({ period = 'week', countOn = '*' }) {
  // todo: load all data in parallel (postgress connection issue)
  const w = 132
  const title = `${appName} · Analytics`
  return (
    <div className="flex flex-col items-center overflow-scroll">
      <pre className="text-sm leading-4 p-4">
        <div>
          <B> ═══ </B>
          <span className="font-bold">{title}</span>
          <B> {''.padEnd(w - title.length - 8, '═')}═ </B>
        </div>
        <B>{'  '.padEnd(w - 2, ' ') + '  '}</B>

        <div className="flex flex-row">
          <Table data={await countUsersByInterval({})} title="DAU" props={['interval', 'count']} w={w / 3} />
          <Table
            data={await countUsersByInterval({ interval: 'week' })}
            title="WAU"
            props={['interval', 'count']}
            w={w / 3}
          />
          <Table
            data={await countUsersByInterval({ interval: 'month' })}
            title="MAU"
            props={['interval', 'count']}
            w={w / 3}
          />
        </div>
        <div className="flex flex-row">
          <Table
            data={await topUsers({ period })}
            title={`Top Users (events/${period})`}
            props={['fid', 'count']}
            w={w / 3}
          />
          <Table
            data={await topScreens({ period, countOn })}
            title={`Top Screens (${countOnLabel(countOn)}/${period})`}
            props={['param', 'count']}
            w={(w * 1) / 3}
          />
          <Table
            data={await topPlatforms({ period, countOn })}
            title={`Top Platforms (${countOnLabel(countOn)}/${period})`}
            props={['platform', 'count']}
            w={w / 3}
          />
        </div>
        <div className="flex flex-row">
          <Table
            data={await topOpenLocations({ period, countOn })}
            title={`Top Mini App Open Locations (${countOnLabel(countOn)}/${period})`}
            props={['locationText', 'count']}
            w={(w * 2) / 3}
          />
          <Table
            data={await topClients({ period, countOn })}
            title={`Top Mini App Clients (${countOnLabel(countOn)}/${period})`}
            props={['client', 'count']}
            w={w / 3}
          />
        </div>
      </pre>
    </div>
  )
}

function Table({ data, title, props, w }) {
  const renderProp = (item, prop) => {
    const gap = '   '
    let text = String(item[prop] || '')
    if (prop == 'count') return gap + text.padStart(5)
    if (text.length > w - 18) text = text.slice(0, w - 21) + '...'
    if (item.link)
      return (
        <span key={prop}>
          <a
            href={item.link}
            target="_blank"
            // className="underline underline-offset-2 decoration-neutral-300 dark:decoration-neutral-600"
          >
            {text}
          </a>
          {''.padEnd(w - text.length - 18)}
        </span>
      )
    return text.padEnd(w - 18)
  }
  const renderRow = (item) => {
    return <>{props.map((prop) => renderProp(item, prop))}</>
  }

  return (
    <div>
      <div>
        <B> ┌── </B>
        <span className="font-bold">{title}</span>
        <B> {''.padEnd(w - title.length - 10, '─')}──┐ </B>
      </div>
      <Spacer w={w} />
      {data.map((item, i) => (
        <div key={i}>
          <B>{' │   '}</B>
          <span className="opacity-90">{renderRow(item)}</span>
          <B>{'   │ '}</B>
        </div>
      ))}
      <Spacer w={w} />
      {Array.from({ length: 10 - data.length }, (e, i) => (
        <Spacer key={i} w={w} />
      ))}
      <div>
        <B> └──{''.padEnd(w - 6, '─')}┘ </B>
      </div>
      <div> </div>
    </div>
  )
}

function B({ children }) {
  return <span className="text-neutral-300 dark:text-neutral-600">{children}</span>
}

function Spacer({ w }) {
  return (
    <div>
      <B>{' │'.padEnd(w - 2, ' ') + '│ '}</B>
    </div>
  )
}

function countUsersByInterval({ interval = 'day' }: { interval?: 'day' | 'week' | 'month' }) {
  const intervalExpr = getIntervalExpression(interval)
  return analyticsQuery(`
  select ${intervalExpr} as interval, COUNT(distinct fid) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '-1 year')
  group by interval
  order by interval desc
  limit 10`)
}
function topOpenLocations({ period = 'week', countOn = '*' }) {
  const periodModifier = getPeriodModifier(period)
  const countExpression = getCountExpression(countOn)
  return analyticsQuery(`
  select param, COUNT(${countExpression}) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '${periodModifier}') and event = 'miniapp_open'
  group by param
  order by count desc
  limit 10`).then(miniappLocationDataTransformer)
}
function topClients({ period = 'week', countOn = '*' }) {
  const periodModifier = getPeriodModifier(period)
  const countExpression = getCountExpression(countOn)
  return analyticsQuery(`
  select param, COUNT(${countExpression}) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '${periodModifier}') and event = 'miniapp_open'
  group by param
  order by count desc
  limit 500`).then(miniappClientDataTransformer)
}
function topScreens({ period = 'week', countOn = '*' }) {
  const periodModifier = getPeriodModifier(period)
  const countExpression = getCountExpression(countOn)
  return analyticsQuery(`
  select param, COUNT(${countExpression}) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '${periodModifier}') and event = 'screen_view'
  group by param
  order by count desc
  limit 10`).then(screenDataTransformer)
}
function topUsers({ period = 'week' }) {
  const periodModifier = getPeriodModifier(period)
  return analyticsQuery(`
  select fid, COUNT(*) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '${periodModifier}')
  group by fid
  order by count desc
  limit 10`).then(userDataTransformer)
}
function topPlatforms({ period = 'week', countOn = '*' }) {
  const periodModifier = getPeriodModifier(period)
  const countExpression = getCountExpression(countOn)
  return analyticsQuery(`
  select platform, COUNT(${countExpression}) as count
  from analytics_events
  where substr(created_at, 1, 19) >= datetime('now', '${periodModifier}')
  group by platform
  order by count desc
  limit 10`)
}

function getIntervalExpression(interval: 'day' | 'week' | 'month') {
  if (interval === 'week') return `strftime('%Y-W%W', substr(created_at, 1, 19))`
  if (interval === 'month') return `substr(created_at, 1, 7)`
  return `substr(created_at, 1, 10)`
}

function getPeriodModifier(period: string) {
  if (period === 'day') return '-1 day'
  if (period === 'month') return '-1 month'
  if (period === 'year') return '-1 year'
  return '-7 day'
}

function getCountExpression(countOn: string) {
  if (countOn === 'distinct fid') return 'distinct fid'
  return '*'
}

function screenDataTransformer(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      link: item.param,
    }
  })
}
function userDataTransformer(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      link: `https://sonarr.cc/u/fid:${item.fid}`,
    }
  })
}
function miniappLocationDataTransformer(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      locationText: getLocationText(item.param),
      link: getLocationLink(item.param),
    }
  })
}
function miniappClientDataTransformer(data: any) {
  // map to client then group by client, then convert to array
  const clients = data
    .map((item: any) => {
      return {
        ...item,
        // client: getClientFidText(JSON.parse(item.param).clientFid),
        clientFid: JSON.parse(item.param).clientFid,
      }
    })
    .reduce((acc: any, item: any) => {
      const clientFid = item.clientFid
      if (!acc[clientFid]) {
        acc[clientFid] = 0
      }
      acc[clientFid] += Number(item.count)
      return acc
    }, {})
  return Object.entries(clients)
    .map(([clientFid, count]) => ({
      clientFid,
      client: getClientFidText(clientFid),
      count: count as number,
      link: `https://sonarr.cc/u/fid:${clientFid}`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function getLocationText(param: string) {
  let locationText = ''
  if (param) {
    const location = JSON.parse(param)
    locationText += '[' + getClientFidText(location.clientFid).slice(0, 4) + '] '

    locationText +=
      location.locationType
        ?.replace('cast_embed', 'cast embed') // 📝
        .replace('cast_share', 'cast share') // 📝
        .replace('miniapp_open', 'miniapp open') // 🧩
        .replace('notification', 'notification') // 🔔
        .replace('channel', 'channel') // 📡
        .replace('launcher', 'launcher') || '' // 📱

    if (location.locationId) locationText += `: ${location.locationId}`
  }
  return locationText
}
function getClientFidText(clientFid: any) {
  if (!clientFid) return `Farcaster`
  if (clientFid == 9152) return `Farcaster`
  if (clientFid == 399519) return `Base`
  if (clientFid == 309857) return `Base`
  if (clientFid == 827605) return `Zapper`
  if (clientFid == 356900) return `Recaster`
  return `${clientFid}`
}
function getLocationLink(param: string) {
  if (param) {
    const location = JSON.parse(param)
    if (location.locationType == 'cast_embed') return `https://sonarr.cc/p/${location.locationId}`
    if (location.locationType == 'cast_share') return `https://sonarr.cc/p/${location.locationId}`
  }
  return ''
}

async function analyticsQuery(sql: string, params: any[] = []) {
  const result = await dbQuery({ sql, params })
  return safeRows(result)
}

function safeRows(rows: any[]) {
  return rows?.map((row) => {
    const newRow: Record<string, any> = {}
    for (const key in row) {
      if (typeof row[key] === 'bigint') {
        newRow[key] = String(row[key])
      } else {
        newRow[key] = row[key]
      }
    }
    return newRow
  })
}

function countOnLabel(countOn: string) {
  if (countOn === '*') return 'events'
  if (countOn === 'distinct fid') return 'users'
  return countOn
}
