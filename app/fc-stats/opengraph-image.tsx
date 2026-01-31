import { ChartColumn } from 'lucide-static'

import { heroImage } from '@/lib/image'
import { accentColor } from '@/lib/metadata'

export { contentType, size } from '@/lib/image'

export default async function Image({}) {
  return await heroImage({ accentColor, Icon: ChartColumn, title: 'Farcaster Stats', description: `` })
}
