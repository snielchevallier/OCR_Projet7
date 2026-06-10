'use client'

import { useState } from 'react'
import type { Task, Project } from '@/types'
import TaskCard from './TaskCard'

type StatusFilter = 'ALL' | Task['status']

const PRIORITY_ORDER: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 }

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tous les statuts' },
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminé' },
]

export default function TasksList({ tasks, project }: { tasks: Task[]; project: Project }) {
  const [view, setView] = useState<'liste' | 'calendrier'>('liste')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [search, setSearch] = useState('')

  const filtered = tasks
    .filter(t => {
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
      const q = search.toLowerCase()
      const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
    .sort((a, b) => {
      const pa = a.priority ? (PRIORITY_ORDER[a.priority] ?? 4) : 4
      const pb = b.priority ? (PRIORITY_ORDER[b.priority] ?? 4) : 4
      return pa - pb
    })

  return (
    <div className="bg-white rounded-2xl border border-grey-border overflow-hidden">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-grey-border flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-black">Tâches</h2>
          <p className="text-xs text-gray-400 mt-0.5">Par ordre de priorité</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-grey-border overflow-hidden text-sm">
            <button
              onClick={() => setView('liste')}
              aria-pressed={view === 'liste'}
              className={`flex items-center gap-1.5 px-3.5 py-2 transition-colors ${view === 'liste' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Liste
            </button>
            <button
              onClick={() => setView('calendrier')}
              aria-pressed={view === 'calendrier'}
              className={`flex items-center gap-1.5 px-3.5 py-2 transition-colors border-l border-grey-border ${view === 'calendrier' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Calendrier
            </button>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              aria-label="Filtrer par statut"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-grey-border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 cursor-pointer"
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              aria-label="Rechercher une tâche"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une tâche"
              className="pl-3 pr-9 py-2 text-sm border border-grey-border rounded-lg text-gray-600 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 w-52"
            />
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'calendrier' ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Vue calendrier disponible prochainement.
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          {tasks.length === 0 ? 'Aucune tâche pour ce projet.' : 'Aucune tâche ne correspond à votre recherche.'}
        </div>
      ) : (
        <div className="divide-y divide-grey-border">
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
