'use server'

import { apiFetch } from '@/lib/api'

export type User = {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export async function getProfileAction() {
  const res = await apiFetch<{ success: boolean; data: { user: User } }>('/auth/profile')
  return res.data.user
}