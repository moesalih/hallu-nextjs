import { NextRequest, NextResponse } from 'next/server'

import { fetchDirectJSON } from '@/lib/utils/fetch'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return Response.json({ error: 'Missing path parameter' }, { status: 400 })

  const response = await fetchDirectJSON(path)
  return Response.json(response)
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return Response.json({ error: 'Missing path parameter' }, { status: 400 })

  const body = await request.json()
  const response = await fetchDirectJSON(path, 'POST', body)
  return Response.json(response)
}
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return Response.json({ error: 'Missing path parameter' }, { status: 400 })

  const body = await request.json()
  const response = await fetchDirectJSON(path, 'DELETE', body)
  return Response.json(response)
}
