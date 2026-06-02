'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectAction } from '@/actions/projects'

export default function NewProjectModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = name.trim().length > 0 && description.trim().length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function handleClose() {
    setOpen(false)
    setName('')
    setDescription('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await createProjectAction({ name, description })
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleClose}
          />

          {/* Dialog */}
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
                  <button
                    type="button"
                    className="w-full flex justify-between items-center border border-grey-border rounded-lg px-4 py-3 text-sm text-gray-400"
                  >
                    Choisir un ou plusieurs collaborateurs
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
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
