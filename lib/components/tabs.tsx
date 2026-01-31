import { usePathname, useRouter } from 'next/navigation'
import { Suspense } from 'react'

import { Separator } from '@/lib/components/ui'
import { haptics } from '@/lib/utils/haptics'
import { useSearchParamState } from '@/lib/utils/search-params'

export function Tabs({ tabs, selectedTab, setSelectedTab }) {
  const onTabClick = (name: string) => {
    haptics()
    setSelectedTab(name)
  }
  return (
    <>
      <nav className="flex overflow-auto gap-6 gap-y-2 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.filter(Boolean).map(({ id, name, Icon }) => (
          <div
            key={id ?? name}
            className={
              'flex flex-row items-center font-medium py-2 px-0 border-b cursor-pointer flex-shrink-0 gap-2 ' +
              ((id ?? name) === selectedTab ? ' border-current' : ' border-transparent opacity-50')
            }
            onClick={() => onTabClick(id ?? name)}
          >
            {Icon && <Icon className="inline size-4 " />}
            {name}
          </div>
        ))}
      </nav>
    </>
  )
}

export function TabsWithContent({ tabs, initialTab }: { tabs: any[]; initialTab?: string }) {
  return (
    <Suspense>
      <TabsWithContentInner tabs={tabs} initialTab={initialTab} />
    </Suspense>
  )
}
export function TabsWithContentInner({ tabs, initialTab }: { tabs: any[]; initialTab?: string }) {
  const [selectedTab, setSelectedTab] = useSearchParamState('tab')
  const selectedOrInitialTab = selectedTab || initialTab || tabs[0]?.id || tabs[0]?.name
  return (
    <>
      <Tabs tabs={tabs} selectedTab={selectedOrInitialTab} setSelectedTab={setSelectedTab} />
      <Separator />
      <Separator className="opacity-0" />
      {tabs.find((tab) => (tab?.id ?? tab?.name) === selectedOrInitialTab)?.content}
    </>
  )
}

export function NavTabs({ navLinks }) {
  const pathname = usePathname()
  const router = useRouter()
  const selectedTab = navLinks.find((link) => link.path === pathname)?.name

  return (
    <Tabs
      tabs={navLinks}
      selectedTab={selectedTab || ''}
      setSelectedTab={(name) => router.push(navLinks.find((link) => link.name === name)?.path || '/')}
    />
  )
}

export function NavOutlet({ navLinks }) {
  return (
    <>
      <NavTabs navLinks={navLinks} />
      <Separator />
      <Separator className="opacity-0" />
    </>
  )
}
