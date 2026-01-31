import { usePathname, useRouter } from 'next/navigation'

import { LinkedText } from '@/lib/components/LinkedText'
import { MoreMenuWithShare } from '@/lib/components/sheets'

export function Header({
  shareText,
  hideMenu = false,
  children = null,
  primaryActions = null,
  menuOptions = [],
}: {
  shareText?: string
  hideMenu?: boolean
  children?: React.ReactNode
  primaryActions?: React.ReactNode
  menuOptions?: ({ title: string; onClick: () => void } | undefined)[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="p-4  ">
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="shrink">{children}</div>
        <div className="flex flex-row items-center gap-2">
          <MoreMenuWithShare
            menuOptions={menuOptions}
            shareUrl={`${global?.window?.location.origin}${pathname}`}
            shareText={shareText}
          />
          {primaryActions}
          {/* {!hideMenu && <Menu className="size-5 m-1 cursor-pointer opacity-50" onClick={() => router.push('/')} />} */}
        </div>
      </div>
    </div>
  )
}

export function TitleHeader({
  title,
  Icon,
  primaryActions = null,
  shareText,
}: {
  title: string
  Icon: React.ComponentType<any>
  shareText?: string
  primaryActions?: React.ReactNode
}) {
  return (
    <Header shareText={shareText} primaryActions={primaryActions}>
      <div className="flex flex-row items-center gap-3">
        <Icon className="size-6 xmt-[3]" />
        <h1 className="text-2xl font-medium grow">{title}</h1>
      </div>
    </Header>
  )
}

export function ProfileHeader({
  image,
  name,
  description,
  stat,
  shareText,
  primaryActions = null,
  menuOptions = [],
}: {
  image: string
  name: string
  description?: string
  stat: { label: string; value: number }
  shareText: string
  primaryActions?: React.ReactNode
  menuOptions?: ({ title: string; onClick: () => void } | undefined)[]
}) {
  return (
    <div className="mb-4">
      <Header shareText={shareText} primaryActions={primaryActions} menuOptions={menuOptions}>
        <div className="flex flex-row items-center gap-3 ">
          <img className="size-12 rounded-full object-cover" src={image}></img>
          <div className="text-2xl font-semibold">{name}</div>
        </div>
      </Header>
      {description && (
        <div className="flex flex-row items-center gap-2 px-4">
          <div className="text-sm opacity-75">
            <LinkedText>{description?.trim()}</LinkedText>
          </div>
        </div>
      )}
      {/* <div className="flex flex-row items-center gap-2 mt-2">
        <div className="text-sm">{formatNumber(stat.value)}</div>
        <div className="text-sm opacity-50">{stat.label}</div>
      </div> */}
    </div>
  )
}
