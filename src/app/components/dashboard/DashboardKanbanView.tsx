'use client'

import { useState } from 'react'
import type { DashboardTask } from '@/actions/dashboard'
import DashboardKanbanColumn from './DashboardKanbanColumn'

type Props = {
  tasks: DashboardTask[]
}

const STATUSES: DashboardTask['status'][] = ['TODO', 'IN_PROGRESS', 'DONE']

const STATUS_LABEL: Record<DashboardTask['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminées',
}

export default function DashboardKanbanView({ tasks }: Props) {
  const [activeStatus, setActiveStatus] = useState<DashboardTask['status']>('TODO')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 md:hidden">
        {STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            aria-pressed={activeStatus === status}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-400 ${
              activeStatus === status
                ? 'bg-orange/20 text-orange'
                : 'bg-white text-orange hover:bg-orange/10'
            }`}
          >
            {STATUS_LABEL[status]}
          </button>
        ))}
      </div>

      <div className="hidden md:flex gap-4">
        {STATUSES.map(status => (
          <DashboardKanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
          />
        ))}
      </div>

      <div className="md:hidden">
        <DashboardKanbanColumn
          status={activeStatus}
          tasks={tasks.filter(t => t.status === activeStatus)}
        />
      </div>
    </div>
  )
}
