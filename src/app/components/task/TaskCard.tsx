import type { Task, Project } from '@/types'
import { getUserInitials, formatDate } from '@/lib/utils'
import CommentsSection from './CommentsSection'
import TaskOptionsMenu from './TaskOptionsMenu'

const STATUS_LABEL: Record<Task['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
}

const STATUS_STYLE: Record<Task['status'], string> = {
  TODO: 'bg-orange/20 text-orange',
  IN_PROGRESS: 'bg-blue-100 text-blue-600',
  DONE: 'bg-green-100 text-green-700',
}

export default function TaskCard({ task, project }: { task: Task; project: Project }) {
  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-semibold text-black">{task.title}</span>
          <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLE[task.status]}`}>
            {STATUS_LABEL[task.status]}
          </span>
        </div>
        <TaskOptionsMenu task={task} project={project} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
      )}

      {/* Meta */}
      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mb-3">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Échéance : {formatDate(task.dueDate)}</span>
          </div>
        )}

        {task.assignees?.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400">Assigné à :</span>
            {task.assignees.map(a => (
              <div key={a.id} className="flex items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                  {getUserInitials(a.user?.name).replace(' ', '')}
                </span>
                <span className="text-xs text-gray-600">{a.user?.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <CommentsSection projectId={task.projectId} taskId={task.id} />
    </div>
  )
}