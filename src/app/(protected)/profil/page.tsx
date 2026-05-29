'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { updateProfileAction, updatePasswordAction } from '@/actions/profile'
import { logoutAction } from '@/actions/auth'

export default function Profil() {
  const { user, setUser } = useUser()
  const name = user?.name ?? ''
  const firstSpaceIndex = name.indexOf(' ')
  const firstName = firstSpaceIndex >= 0 ? name.slice(0, firstSpaceIndex) : name
  const lastName = firstSpaceIndex >= 0 ? name.slice(firstSpaceIndex + 1) : ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [nochanges, setNoChanges] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setNoChanges(false)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value
    const name = `${firstName} ${lastName}`
    //check si les champs ont été modifiés
    if (user?.email === email && user?.name === name && newPassword === '') {
      setNoChanges(true)
      setLoading(false)
      return
    }
    //check si le name et l'email doivent être modifiés
    if (user?.email !== email || user?.name !== name) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('name', name)
      try {
        const updatedUser = await updateProfileAction(formData)
        setUser(updatedUser)   // ← mise à jour du Context
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }
    //check si le mot de passe doit être modifié
    if (newPassword !== '') {
      const formData = new FormData()
      formData.append('currentPassword', currentPassword)
      formData.append('newPassword', newPassword)
      try {
        await updatePasswordAction(formData)
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }
  }

  async function handleLogout() {
    confirm('Êtes-vous sûr de vouloir vous déconnecter ?') && (await logoutAction())
  }
  return (
    <div className="bg-white w-full max-w-303 flex flex-col
    mx-auto my-8 p-8
    rounded-xl border border-gray-200">
      <div className="flex justify-between mb-6">
        <div >
          <h1 className="text-lg font-semibold text-black">Mon compte</h1>
          <p className="text-base text-gray-500 mb-6">{user?.name ?? ''}</p>
        </div>
        <div>
          <button onClick={handleLogout} className="px-6 py-2.5 bg-black text-background text-sm font-medium rounded-lg hover:bg-orange transition-colors">
            Se déconnecter
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {success && <p className="text-green-600 font-bold mb-4">Profil mis à jour avec succès !</p>}
      {loading && <p className="text-gray-600 mb-4">Mise à jour en cours...</p>}
      {nochanges && <p className="text-yellow-600 font-bold mb-4">Aucune modification effectuée.</p>}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Nom</label>
          <input
            type="text"
            id="lastname"
            name="lastName"
            defaultValue={lastName}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Prénom</label>
          <input
            type="text"
            id="firstname"
            name="firstName"
            defaultValue={firstName}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user?.email ?? ''}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Mot de passe</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            defaultValue=""
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            defaultValue=""
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