'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updateTaskAction } from '@/actions/tasks'
import type { Project, Task } from '@/types'
import { getUserInitials } from '@/lib/utils'

type Assignee = { id: string; name: string; email: string }

const STATUS_OPTIONS: { value: Task['status']; label: string; activeStyle: string }[] = [
  { value: 'TODO', label: 'À faire', activeStyle: 'bg-orange/20 text-orange border-orange/40' },
  { value: 'IN_PROGRESS', label: 'En cours', activeStyle: 'bg-blue-100 text-blue-600 border-blue-300' },
  { value: 'DONE', label: 'Terminée', activeStyle: 'bg-green-100 text-green-700 border-green-300' },
]

type Props = { task: Task; project: Project; open: boolean; onClose: () => void }

export default function EditTaskModal({ task, project, open, onClose }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(task.title ?? '')
  const [description, setDescription] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.dueDate?.slice(0, 10) ?? '')
  const [status, setStatus] = useState<Task['status']>(task.status)
  const [priority, setPriority] = useState<Task['priority']>(task.priority ?? null)
  const [assignees, setAssignees] = useState<Assignee[]>(
    task.assignees.map(a => ({ id: a.user.id, name: a.user.name, email: a.user.email }))
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const allUsers: Assignee[] = [
    { id: project.owner.id, name: project.owner.name, email: project.owner.email },
    ...(project.members ?? [])
      .filter(m => m.userId !== project.owner.id)
      .map(m => ({ id: m.userId, name: m.user.name, email: m.user.email })),
  ]

  const isValid = title.trim().length > 0 && dueDate.length > 0

  useEffect(() => {
    if (!open) return
    setTitle(task.title ?? '')
    setDescription(task.description ?? '')
    setDueDate(task.dueDate?.slice(0, 10) ?? '')
    setStatus(task.status)
    setPriority(task.priority ?? null)
    setAssignees(task.assignees.map(a => ({ id: a.user.id, name: a.user.name, email: a.user.email })))
    setError(null)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!dropdownOpen) return
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [dropdownOpen])

  function toggleAssignee(user: Assignee) {
    setAssignees(prev =>
      prev.some(a => a.id === user.id)
        ? prev.filter(a => a.id !== user.id)
        : [...prev, user]
    )
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await updateTaskAction(task.projectId, task.id, {
        title,
        description,
        dueDate,
        status,
        priority,
        assigneeIds: assignees.map(a => a.id),
      })
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const assigneeLabel = assignees.length === 0
    ? 'Choisir un ou plusieurs collaborateurs'
    : assignees.map(a => a.name || a.email).join(', ')

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-xl">

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl leading-none"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-black mb-7">Modifier la tâche</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Titre*</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Description*</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Échéance*</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Assigné à :</label>
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(v => !v)}
                  className="w-full flex justify-between items-center border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
                >
                  <span className={assignees.length > 0 ? 'text-black' : 'text-gray-400'}>
                    {assigneeLabel}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <ul className="absolute left-0 right-0 top-full mt-1 z-10 bg-white border border-grey-border rounded-lg shadow-lg overflow-hidden">
                    {allUsers.map(u => {
                      const selected = assignees.some(a => a.id === u.id)
                      return (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => toggleAssignee(u)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-black border-black' : 'border-gray-300'}`}>
                              {selected && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                              {getUserInitials(u.name).replace(' ', '')}
                            </span>
                            <span className="font-medium text-black">{u.name}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Statut :</label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      status === opt.value ? opt.activeStyle : 'bg-gray-100 text-gray-400 border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Priorité</label>
              <select
                value={priority ?? ''}
                onChange={e => setPriority((e.target.value || null) as Task['priority'])}
                className="w-full border border-grey-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              >
                <option value="">— Choisir une priorité</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="mt-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors
                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                enabled:bg-black enabled:text-white enabled:hover:bg-orange"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}