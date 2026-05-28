'use server'

import { login, logout, register } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
    
  try {
    const user = await login(email, password)
    redirect('/dashboard')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Identifiants invalides',
    }
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    if(!email || !password || !name) {
      return {
        success: false,
        message: 'Tous les champs sont requis',
      }
    }
    const user = await register(email, password, name)
    redirect('/dashboard')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Inscription échouée',
    }
  }
}

export async function logoutAction() {
  await logout()
  redirect('/login')
}