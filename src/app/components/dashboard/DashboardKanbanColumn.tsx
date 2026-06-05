import type { DashboardTask } from '@/actions/dashboard'
import DashboardTaskCard from './DashboardTaskCard'

type Props = {
  status: DashboardTask['status']
  tasks: DashboardTask[]
}

const STATUS_LABEL: Record<DashboardTask['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminées',
}

export default function DashboardKanbanColumn({ status, tasks }: Props) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 bg-[#F8F8F8] rounded-2xl p-4">
      <div className="flex items-center gap-2 px-1 py-2">
        <span className="text-sm font-semibold text-black">{STATUS_LABEL[status]}</span>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <DashboardTaskCard key={task.id} task={task} variant="kanban" />
        ))}
      </div>
    </div>
  )
}