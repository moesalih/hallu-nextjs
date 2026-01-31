import { Newspaper } from 'lucide-static'

import { base64Icon, homeImage, ogImage } from '@/lib/image'
import { fetchStarterPack } from '@/lib/services/farcaster'

export { contentType, size } from '@/lib/image'

export default async function Image({ params }) {
  const { id } = await params
  return await packImage(id)
}

export async function packImage(id: string) {
  const pack = await fetchStarterPack(id)
  if (!pack) return await homeImage()

  const creator = pack?.creator
  const users = pack?.items

  return await ogImage(
    <div tw="w-full h-full flex justify-start items-start text-[100px] bg-black text-white p-[50px]">
      <div tw="flex flex-col items-start ">
        <div tw="flex flex-row items-center mb-[10px]">
          <img tw="w-[50px] h-[50px] opacity-50" src={base64Icon(Newspaper)} />
          <div tw="flex text-[40px] tracking-[-1px] ml-[15px] opacity-50">Starter Pack</div>
        </div>
        <div tw="flex text-[70px] font-semibold tracking-[-3px] mb-[70px]">{pack?.name || id}</div>

        {creator && (
          <div tw="flex flex-col items-start mb-[40px]">
            <div tw="flex text-[20px] uppercase opacity-50 mb-[15px]">Created by</div>
            <div tw="flex flex-row items-center">
              <img tw="rounded-full w-[60px] h-[60px] object-cover bg-neutral-500/10" src={creator?.pfp?.url} />
              <div tw="flex text-[40px] font-semibold tracking-[-1px] ml-[15px]">{creator?.username}</div>
            </div>
          </div>
        )}

        {users?.length > 1 && (
          <div tw="flex flex-col items-start">
            <div tw="flex text-[20px] uppercase opacity-50 mb-[15px]">{pack?.itemCount} users</div>
            <div tw="flex flex-row items-center ml-[-5px]">
              {users?.slice(0, 10).map((s) => (
                <div key={s.fid} tw="flex mr-[-40px]">
                  <img
                    tw="rounded-full w-[120px] h-[120px] object-cover border-[5px] border-black bg-neutral-500/10"
                    src={s?.item?.pfp?.url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
