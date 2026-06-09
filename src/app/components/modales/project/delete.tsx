'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProjectAction } from '@/actions/projects'
import { useOwnership } from '@/hooks/useOwnership'
import ConfirmModal from '@/app/components/modales/ConfirmModal'
import type { Project } from '@/types'

export default function DeleteProjectButton({ project }: { project: Project }) {
  const isOwner = useOwnership(project.ownerId)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOwner) return null

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      await deleteProjectAction(project.id)
      setOpen(false)
      router.push('/projets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-red-400 hover:text-red-600 transition-colors"
      >
        Supprimer
      </button>

      <ConfirmModal
        open={open}
        onClose={() => { setOpen(false); setError(null) }}
        message="Supprimer le projet ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        error={error ?? undefined}
        loading={loading}
      />
    </>
  )
}