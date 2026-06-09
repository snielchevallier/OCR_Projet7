'use client'

import { useUser } from '@/context/UserContext'

export function useOwnership(ownerId: string | undefined): boolean {
  const { user } = useUser()
  if (!user || !ownerId) return false
  return user.id === ownerId
}