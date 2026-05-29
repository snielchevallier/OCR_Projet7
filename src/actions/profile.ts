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

export async function updateProfileAction(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const res = await apiFetch<{ success: boolean; data: { user: User } }>('/auth/profile', {
    method: 'PUT',
    body: { name, email },
  })
  return res.data.user
}

export async function updatePasswordAction(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string

  if (!currentPassword || !newPassword) {
    throw new Error('Tous les champs sont requis')
  }
  if (currentPassword === newPassword) {
    throw new Error('Le nouveau mot de passe doit être différent du mot de passe actuel')
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(newPassword)) {
    throw new Error('Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)')
  }

  await apiFetch<{ success: boolean; message: string }>('/auth/password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  })
}