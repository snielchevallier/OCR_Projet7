'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectAction, searchUsersAction } from '@/actions/projects'
import { getUserInitials } from '@/lib/utils'

type UserResult = { id: string; email: string; name: string }

export default function NewProjectModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [contributors, setContributors] = useState<UserResult[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const isValid = name.trim().length > 0 && description.trim().length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!results.length) return
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResults([])
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [results.length])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const users = await searchUsersAction(query)
        setResults(users.filter(u => !contributors.some(c => c.id === u.id)))
      } catch {
        // ignore search errors silently
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, contributors])

  function handleClose() {
    setOpen(false)
    setName('')
    setDescription('')
    setContributors([])
    setQuery('')
    setResults([])
    setError(null)
  }

  function addContributor(user: UserResult) {
    setContributors(prev => [...prev, user])
    setResults([])
    setQuery('')
  }

  function removeContributor(id: string) {
    setContributors(prev => prev.filter(c => c.id !== id))
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await createProjectAction({
        name,
        description,
        contributors: contributors.map(c => c.email),
      })
      handleClose()
      router.refresh()
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-black text-background text-sm font-medium rounded-lg hover:bg-orange transition-colors"
      >
        + Créer un projet
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />

          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-xl">

              <button
                onClick={handleClose}
                aria-label="Fermer"
                className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl leading-none"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-black mb-7">Créer un projet</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">Titre*</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">Description*</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">Contributeurs</label>

                  {contributors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {contributors.map(c => (
                        <span
                          key={c.id}
                          className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-[10px] flex items-center justify-center font-semibold shrink-0">
                            {getUserInitials(c.name).replace(' ', '')}
                          </span>
                          {c.name || c.email}
                          <button
                            type="button"
                            onClick={() => removeContributor(c.id)}
                            className="ml-0.5 text-gray-400 hover:text-black leading-none"
                            aria-label={`Retirer ${c.name}`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div ref={searchRef} className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Rechercher par nom ou email..."
                      className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
                    />
                    {searching && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ...
                      </span>
                    )}

                    {results.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full mt-1 z-10 bg-white border border-grey-border rounded-lg shadow-lg overflow-hidden">
                        {results.map(u => (
                          <li key={u.id}>
                            <button
                              type="button"
                              onClick={() => addContributor(u)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                                {getUserInitials(u.name).replace(' ', '')}
                              </span>
                              <span>
                                <span className="font-medium text-black">{u.name}</span>
                                <span className="text-gray-400 ml-2 text-xs">{u.email}</span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="mt-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors
                    disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                    enabled:bg-black enabled:text-white enabled:hover:bg-orange"
                >
                  {loading ? 'Création...' : 'Ajouter un projet'}
                </button>

              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
