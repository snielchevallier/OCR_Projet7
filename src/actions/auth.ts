'use server'

import { login, logout, register } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

import { PASSWORD_REGEX } from '@/lib/validations'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = formData.get('callbackUrl') as string | null
  const redirectTo = callbackUrl?.startsWith('/') ? callbackUrl : '/dashboard'

  try {
    if(!email || !password) {
      return {
        success: false,
        message: 'Tous les champs sont requis',
      }
    }
    await login(email, password)
    redirect(redirectTo)
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

    if (!PASSWORD_REGEX.test(password)) {
      throw new Error('Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)')
    }
    await register(email, password, name)
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
