'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOwnership } from '@/hooks/useOwnership'
import { deleteTaskAction } from '@/actions/tasks'
import type { Task, Project } from '@/types'
import EditTaskModal from '@/app/components/modales/task/edit'
import ConfirmModal from '@/app/components/modales/ConfirmModal'

type Props = { task: Task; project: Project }

export default function TaskOptionsMenu({ task, project }: Props) {
  const isOwner = useOwnership(task.creator?.id)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (!isOwner) return null

  async function handleDelete() {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteTaskAction(task.projectId, task.id)
      setConfirmOpen(false)
      router.refresh()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <div ref={ref} className="relative shrink-0 -mr-1 -mt-1">
        <button
          onClick={() => setOpen(v => !v)}
          className="text-gray-400 hover:text-black transition-colors p-1"
          aria-label="Options"
          aria-expanded={open}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 z-50 min-w-32.5 rounded-lg bg-black shadow-lg overflow-hidden">
            <button
              onClick={() => { setOpen(false); setEditOpen(true) }}
              className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={() => { setOpen(false); setConfirmOpen(true) }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <EditTaskModal
        task={task}
        project={project}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteError(null) }}
        message="Supprimer la tâche ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        error={deleteError ?? undefined}
        loading={deleteLoading}
      />
    </>
  )
}