'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProjectAction } from '@/actions/projects'
import { useUser } from '@/context/UserContext'
import ConfirmModal from '@/app/components/modales/ConfirmModal'
import type { Project } from '@/types'

export default function DeleteProjectButton({ project }: { project: Project }) {
  const { user } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (user?.id !== project.ownerId) return null

  async function handleDelete() {
    await deleteProjectAction(project.id)
    router.push('/projets')
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
        onClose={() => setOpen(false)}
        message="Supprimer le projet ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
      />
    </>
  )
}