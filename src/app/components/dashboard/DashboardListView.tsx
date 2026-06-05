import type { DashboardTask } from '@/actions/dashboard'
import DashboardTaskCard from './DashboardTaskCard'

export default function DashboardListView({ tasks }: { tasks: DashboardTask[] }) {
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
            placeholder="Rechercher une tâche"
            className="text-sm border border-grey-border rounded-lg px-3 py-2 pl-9 outline-none w-full md:w-64"
            disabled
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8 flex flex-col gap-4">
        {tasks.map(task => (
          <DashboardTaskCard key={task.id} task={task} variant="list" />
        ))}
      </div>
    </div>
  )
}