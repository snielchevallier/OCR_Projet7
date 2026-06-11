import type { DashboardTask } from '@/actions/dashboard'
import { useState } from 'react'
import DashboardTaskCard from './DashboardTaskCard'

const PRIORITY_ORDER: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 }

const filtered = (tasks: DashboardTask[], search: string ) => {
  return tasks
    .filter(t => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      return matchSearch
    })
    .sort((a, b) => {
      const pa = a.priority ? (PRIORITY_ORDER[a.priority] ?? 4) : 4
      const pb = b.priority ? (PRIORITY_ORDER[b.priority] ?? 4) : 4
      return pa - pb
    })
  }
export default function DashboardListView({ tasks }: { tasks: DashboardTask[] }) {
  const [search, setSearch] = useState('')
  const sorted = filtered(tasks, search)
  return (
    <div className="border border-grey-border rounded-2xl bg-white overflow-hidden p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-8 py-8">
        <div>
          <h2 className="text-sm font-semibold text-black">Mes tâches assignées</h2>
          <p className="text-xs text-gray-400">Par ordre de priorité</p>
        </div>
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

      <div className="px-4 md:px-8 pb-8 flex flex-col gap-4">
        {sorted.length === 0
          ? <p className="text-sm text-gray-400 text-center py-4">Aucune tâche trouvée</p>
          : sorted.map(task => (
              <DashboardTaskCard key={task.id} task={task} variant="list" />
            ))
        }
      </div>
    </div>
  )
}
