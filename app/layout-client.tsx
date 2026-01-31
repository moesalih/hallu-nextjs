'use client'

import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const widePaths = ['/analytics', '/fc-stats']
  const widthClass = widePaths.includes(pathname) ? 'max-w-6xl' : 'max-w-2xl'
  return <div className={`${widthClass} mx-auto font-sans`}>{children}</div>
}
