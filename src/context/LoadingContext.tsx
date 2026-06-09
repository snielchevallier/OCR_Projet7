'use client'

import { createContext, useContext, useState } from 'react'
import Spinner from '@/app/components/ui/Spinner'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (v: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && <Spinner />}
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading(): LoadingContextType {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error('useLoading must be used inside LoadingProvider')
  return ctx
}
