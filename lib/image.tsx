import { readFileSync } from 'fs'
import { Radar } from 'lucide-static'
import { ImageResponse } from 'next/og'
import path from 'path'

import { accentColor, appDescription, appName } from '@/lib/metadata'

const BrandIcon = Radar

export const size = { width: 945, height: 630 }
export const contentType = 'image/png'

export async function homeImage() {
  return await heroImage({
    accentColor,
    Icon: BrandIcon,
    title: appName,
    description: appDescription,
  })
}

export async function heroImage({ accentColor, Icon, title, description }) {
  return await ogImage(
    <div tw="w-full h-full flex justify-center items-center text-[100px] bg-black text-white p-[50px]">
      <div tw="flex flex-col justify-center items-center">
        <div tw={`w-[200px] h-[200px] flex justify-center items-center bg-[${accentColor}] text-white rounded-[50px]`}>
          <img tw="w-[136px] h-[136px]" src={base64Icon(Icon)} />
        </div>
        <div tw="h-[40px]"></div>
        <div tw="flex text-[100px] tracking-[-5px] font-semibold">{title}</div>
        <div tw="flex text-[30px] opacity-50 tracking-[-1px]">{description}</div>
      </div>
    </div>
  )
}

export async function profileImage(name: string, image: string) {
  return await ogImage(
    <div tw="w-full h-full flex justify-center items-center text-[100px] bg-black text-white p-[50px]">
      <div tw="absolute flex top-[30px] left-[30px]">
        <div tw={`w-[50px] h-[50px] flex justify-center items-center bg-[${accentColor}] text-white rounded-[12px]`}>
          <img tw="w-[34px] h-[34px]" src={base64Icon(BrandIcon)} />
        </div>
      </div>
      <div tw="flex flex-col justify-center items-center">
        <img tw="rounded-full w-[200px] h-[200px] bg-neutral-500/10" src={image} />
        <div tw="h-[20px]"></div>
        <div tw="flex text-[100px] tracking-[-5px] font-semibold">{name}</div>
      </div>
    </div>
  )
}

export async function iconImage(rounded = false) {
  const roundedClass = rounded ? 'rounded-[128px]' : ''
  return await ogImage(
    <div
      tw={`w-full h-full flex justify-center items-center text-[100px] bg-[${accentColor}] text-white p-[50px] ${roundedClass}`}
    >
      <img tw="w-[350px] h-[350px]" src={base64Icon(BrandIcon)} />
    </div>,
    {
      width: 512,
      height: 512,
    }
  )
}

//////////

export async function ogImage(body: React.ReactElement, options: Record<string, any> = {}) {
  return new ImageResponse(body, {
    ...size,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
    ...options,
    fonts: await loadFonts(),
  })
}

const fontsConfig = [
  { name: 'Inter', weight: 400, fontFile: 'Inter-Regular' },
  // { name: "Inter", weight: 500, fontFile: "Inter-Medium" },
  { name: 'Inter', weight: 600, fontFile: 'Inter-SemiBold' },
  // { name: 'Inter', weight: 700, fontFile: 'Inter-Bold' },
]

const loadFonts = async () => {
  const fontPromises = fontsConfig.map(async (font) => {
    // const fontUrl = 'https://cdn.jsdelivr.net/npm/@tamagui/font-inter@1.108.3/otf/' + font.fontFile + '.otf'
    // const fontArrayBuf = await fetch(fontUrl).then((res) => res.arrayBuffer())
    const fontArrayBuf = readFileSync(path.join(process.cwd(), 'static', font.fontFile + '.ttf'))
    return { name: font.name, data: fontArrayBuf, weight: font.weight }
  })
  const fonts: any = await Promise.all(fontPromises)

  return fonts
}

export const base64Icon = (svg: any) => {
  if (!svg) return undefined
  svg = svg.replace('stroke="currentColor"', 'stroke="white"')
  const base64 = Buffer.from(svg).toString('base64')
  // console.log('getIconDataUrl', name, svg, base64)
  return `data:image/svg+xml;base64,${base64}`
}
