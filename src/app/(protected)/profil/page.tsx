'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'

export default function Profil() {
  const { user, setUser } = useUser()
  const name = user?.name ?? ''
  const firstSpaceIndex = name.indexOf(' ')
  const firstName = firstSpaceIndex >= 0 ? name.slice(0, firstSpaceIndex) : name
  const lastName = firstSpaceIndex >= 0 ? name.slice(firstSpaceIndex + 1) : ''
  return (
    <div className="bg-white w-full max-w-303 flex flex-col
    mx-auto my-8 p-8
    rounded-xl border border-gray-200">
        <h1 className="text-lg font-semibold text-black">Mon compte</h1>
        <p className="text-base text-gray-500 mb-6">{user?.name ?? ''}</p>
        <form className="flex flex-col gap-5">
    <div>
      <label className="block text-sm font-medium text-black mb-1">Nom</label>
      <input
        type="text"
        name="lastName"
        defaultValue={lastName}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-black mb-1">Prénom</label>
      <input
        type="text"
        name="firstName"
        defaultValue={firstName}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-black mb-1">Email</label>
      <input
        type="email"
        defaultValue={user?.email ?? ''}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-black mb-1">Mot de passe</label>
      <input
        type="password"
        defaultValue="password123"
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
      />
    </div>

    <div className="mt-2">
      <button
        type="submit"
        className="px-6 py-2.5 bg-black text-background text-sm font-medium rounded-lg hover:bg-orange transition-colors"
      >
        Modifier les informations
      </button>
    </div>
  </form>
    </div>
  );
}