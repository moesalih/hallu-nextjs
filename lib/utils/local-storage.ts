'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useLocalStorageState<T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void] {
  const queryClient = useQueryClient()
  const queryKey = ['localStorage', key]

  const { data } = useQuery({
    queryKey,
    queryFn: () => getStorageValue<T>(key, initialValue),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const setValue = useCallback(
    (value: T | ((prev: T | undefined) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(data) : value
        window?.localStorage?.setItem(key, JSON.stringify(valueToStore))
        queryClient.setQueryData(queryKey, valueToStore)
      } catch (error) {
        console.error('Error setting localStorage value:', error)
      }
    },
    [key, initialValue, queryClient, queryKey]
  )

  return [data, setValue]
}

function getStorageValue<T>(key: string, initialValue?: T): T | undefined {
  try {
    const item = window?.localStorage?.getItem(key)
    if (!item) return initialValue
    return JSON.parse(item) as T
  } catch {
    return initialValue
  }
}
