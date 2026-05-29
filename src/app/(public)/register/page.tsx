'use client'

import Link from 'next/link'
import Image from 'next/image';

import { useState } from 'react'
import { registerAction } from '@/actions/auth'

export default function Register() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const lastname = (form.elements.namedItem('lastname') as HTMLInputElement).value
    const firstname = (form.elements.namedItem('firstname') as HTMLInputElement).value
    const name = `${firstname} ${lastname}`

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('name', name)
    const result = await registerAction(formData)

    if (result?.success === false) {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <main className="w-full bg-signin bg-cover bg-center">
      <div className="bg-background w-full md:w-140 
        flex flex-col
        px-6
        min-h-screen">
        <div className="pt-16">
          <Image
            src="/img/logo.png"
            alt="Logo Abricot.co"
            width={252}
            height={32}
            className="mx-auto"
            preload={true}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl mb-4 text-orange font-manrope font-bold text-center">
            Inscription
          </h1>
          {error && (
          <p className="text-red-600 font-bold text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="w-70 mx-auto mt-4 gap-4 flex flex-col">
            <div className="mb-2">
              <label htmlFor="lastname" className="block text-sm font-normal text-black">
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre nom"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="firstname" className="block text-sm font-normal text-black">
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre prénom"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-normal text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre email"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-normal text-black">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre mot de passe"
              />
            </div>
            <button
              type="submit"
              className="
              w-full py-2 px-4 
              bg-black text-white text-base font-medium
              rounded-md 
              hover:bg-orange/90 
              focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              S'inscrire
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            &nbsp;
          </p>
        </div>
        <div className="pb-8">
          
          <p className="mt-2 text-center text-sm text-gray-600">
            Déjà inscrit ? <Link href="/login" className="text-orange hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </main>
  );
}