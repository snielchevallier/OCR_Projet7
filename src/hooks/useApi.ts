'use client'

import { useState, useCallback } from 'react'

type State<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T, Args extends unknown[]>(
  action: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null })

      try {
        const data = await action(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Une erreur est survenue'
        setState({ data: null, loading: false, error: message })
        return null
      }
    },
    [action]
  )

  return { ...state, execute }
}