'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { DashboardTask } from '@/actions/dashboard'
import type { Project, Task } from '@/types'
import { getProjectAction } from '@/actions/projects'
import { formatDate } from '@/lib/utils'
import EditTaskModal from '@/app/components/modales/task/edit'
import { useLoading } from '@/context/LoadingContext'

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

export default function DashboardTaskCard({ task, variant }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const { isLoading, setLoading } = useLoading()

  async function handleOpen() {
    setLoading(true)
    try {
      const data = await getProjectAction(task.project.id)
      setProject(data)
    } finally {
      setLoading(false)
    }
  }

  const statusBadge = (
    <span className={`px-3 py-1 text-xs rounded-full font-medium shrink-0 ${STATUS_STYLE[task.status]}`}>
      {STATUS_LABEL[task.status]}
    </span>
  )

  const metadata = (
    <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
      <span className="flex items-center gap-1.5">
        <Image src="/img/ico-file.png" alt="" width={13} height={13} />
        {task.project.name}
      </span>
      {task.dueDate && (
        <>
          <span className="text-gray-300 mx-1">|</span>
          <span className="flex items-center gap-1.5">
            <Image src="/img/ico-calendar.png" alt="" width={13} height={13} />
            {formatDate(task.dueDate)}
          </span>
        </>
      )}
      <>
        <span className="text-gray-300 mx-1">|</span>
        <span className="flex items-center gap-1.5">
          <Image src="/img/ico-comment.png" alt="" width={13} height={13} />
          {task.comments.length}
        </span>
      </>
    </div>
  )

  const viewButton = (
    <button
      onClick={handleOpen}
      disabled={isLoading}
      className="bg-black text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
    >
      {isLoading ? '...' : 'Voir'}
    </button>
  )

  return (
    <>
      {variant === 'list' ? (
        <div className="flex items-stretch justify-between gap-6 px-3 md:px-6 py-5 border border-grey-border rounded-xl bg-white">
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-black mb-1">{task.title}</p>
              {task.description && (
                <p className="text-sm text-gray-400 line-clamp-1">{task.description}</p>
              )}
            </div>
            {metadata}
          </div>
          <div className="flex flex-col items-end justify-between shrink-0 gap-8">
            {statusBadge}
            {viewButton}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-4 border border-grey-border rounded-xl bg-white">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-black">{task.title}</p>
            {statusBadge}
          </div>
          {task.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
          )}
          {metadata}
          <button
            onClick={handleOpen}
            disabled={isLoading}
            className="w-fit bg-black text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {isLoading ? '...' : 'Voir'}
          </button>
        </div>
      )}

      {project && (
        <EditTaskModal
          task={task as unknown as Task}
          project={project}
          open={true}
          onClose={() => setProject(null)}
        />
      )}
    </>
  )
}
