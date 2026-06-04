import { cookies } from 'next/headers'

const API_URL = process.env.BACKEND_API_URL

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  if (res.status === 401) {
    throw new ApiError(401, 'Session expirée, veuillez vous reconnecter')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const details = Array.isArray(data.errors) && data.errors.length > 0
      ? ` — ${data.errors.join(', ')}`
      : ''
    throw new ApiError(res.status, `${data.message ?? `Erreur ${res.status}`}${details}`)
  }

  return res.json() as Promise<T>
}