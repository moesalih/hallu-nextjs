import { useState } from 'react'

import { Button } from '@/lib/components/ui'
import { useAuth } from '@/lib/providers/auth-provider'
import { haptics } from '@/lib/utils/haptics'

export function InteractionButton({ active = false, activeText, inactiveText, onPress }) {
  const auth = useAuth()
  const [activeState, setActiveState] = useState(active)

  if (!auth?.writeAuthenticated) return null

  const onPress_ = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onPress) return

    haptics()
    const result = await onPress(activeState)
    if (result) {
      const isActive = !activeState
      setActiveState(isActive)
      haptics()
    }
  }

  return (
    <Button variant={activeState ? 'outline' : 'primary'} className="rounded-full!" onClick={onPress_}>
      {activeState ? activeText : inactiveText}
    </Button>
  )
}
