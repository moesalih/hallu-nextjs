'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useSearchParamState(key: string): [string | null, (value: string) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = searchParams.get(key)

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, newValue)
      router.push(pathname + '?' + params.toString())
    },
    [router, pathname, searchParams, key],
  )

  return [value, setValue]
}
