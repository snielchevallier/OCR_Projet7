import type { DashboardTask } from '@/actions/dashboard'
import { formatDate } from '@/lib/utils'

type Props = {
  task: DashboardTask
  variant: 'list' | 'kanban'
}

const STATUS_LABEL: Record<DashboardTask['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
}

const STATUS_STYLE: Record<DashboardTask['status'], string> = {
  TODO: 'bg-orange/20 text-orange',
  IN_PROGRESS: 'bg-blue-100 text-blue-600',
  DONE: 'bg-green-100 text-green-700',
}

export default function DashboardTaskCard({ task, variant: _variant }: Props) {
  return (
    <div className="flex items-stretch justify-between gap-6 px-3 md:px-6 py-5 border border-grey-border rounded-xl bg-white">
      {/* Contenu gauche */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-black mb-1">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-400 line-clamp-1">{task.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {task.project.name}
          </span>
          {task.dueDate && (
            <>
              <span className="text-gray-300 mx-1">|</span>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(task.dueDate)}
              </span>
            </>
          )}
          <>
            <span className="text-gray-300 mx-1">|</span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {task.comments.length}
            </span>
          </>
        </div>
      </div>

      {/* Colonne droite : badge en haut, bouton en bas */}
      <div className="flex flex-col items-end justify-between shrink-0 gap-8">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${STATUS_STYLE[task.status]}`}>
          {STATUS_LABEL[task.status]}
        </span>
        <button className="bg-black text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Voir
        </button>
      </div>
    </div>
  )
}
