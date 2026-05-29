import { cookies } from 'next/headers'

const API_URL = process.env.BACKEND_API_URL

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? 'Identifiants invalides')
  }

  const json = await res.json()
  // La réponse est { success, message, data: { user, token } }
  const { user, token } = json.data
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return user // on retourne l'objet user directement
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    // On remonte le message le plus précis possible
    throw new Error(error.message ?? 'Inscription échouée')
  }

  const json = await res.json()
  const { user, token } = json.data

  // Même logique que le login : on pose le cookie directement
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return user
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value ?? null
}