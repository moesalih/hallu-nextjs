import { NextRequest } from 'next/server'

import { iconImage } from '@/lib/image'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return await iconImage(searchParams.get('rounded') === '1')
}
