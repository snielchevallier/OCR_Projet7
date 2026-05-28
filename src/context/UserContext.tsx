'use client'

import { createContext, useContext, useState } from 'react'

export type User = {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: User | null
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(initialUser)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}
