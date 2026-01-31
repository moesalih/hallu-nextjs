import { useInfiniteQuery } from 'wagmi/query'

import { NotificationIcon, NotificationUnreadIcon } from '@/lib/components/icons'
import { useAuth } from '@/lib/providers/auth-provider'
import { fetchNotifications } from '@/lib/services/neynar'

export function useNotificationsQueryProps({ type = '' }) {
  const auth = useAuth()
  if (!auth?.userFid) return null
  return {
    queryKey: ['notifications', auth?.userFid, type],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      fetchNotifications({ fid: auth.userFid, cursor: pageParam, type }),
  }
}

export function useNotifications() {
  const queryProps = useNotificationsQueryProps({})
  const queryResult = useInfiniteQuery({
    queryKey: queryProps!.queryKey,
    queryFn: queryProps!.queryFn,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: undefined,
    enabled: !!queryProps,
  })
  return queryResult
}

export function DynamicNotificationIcon(props) {
  const auth = useAuth()
  const notifications = useNotifications()
  const hasUnread = (notifications?.data as any)?.pages?.[0]?.unseen_notifications_count > 0
  const Icon = hasUnread ? NotificationUnreadIcon : NotificationIcon
  return <Icon {...props} />
}
