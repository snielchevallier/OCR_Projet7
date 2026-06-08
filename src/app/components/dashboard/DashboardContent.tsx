'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useUser } from '@/context/UserContext'
import NewProjectModal from '@/app/components/modales/project/new'
import DashboardListView from './DashboardListView'
import DashboardKanbanView from './DashboardKanbanView'
import type { DashboardTask } from '@/actions/dashboard'

export default function DashboardContent({ tasks, error }: { tasks: DashboardTask[], error?: string }) {
  const { user } = useUser()
  const [view, setView] = useState<'list' | 'kanban'>('list')

  return (
    <div className="w-full max-w-303 flex flex-col mx-auto my-8 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-black">Tableau de bord</h1>
          <p className="text-base text-gray-500">Bonjour {user?.name}, voici un aperçu de vos projets et tâches</p>
        </div>
        <div>
          <NewProjectModal />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-400 ${
            view === 'list' ? 'bg-orange/20 text-orange' : 'bg-white text-orange hover:bg-orange/10'
          }`}
        >
          <Image src="/img/ico-list.png" alt="Liste" width={12} height={12} />
          Liste
        </button>
        <button
          onClick={() => setView('kanban')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-400 ${
            view === 'kanban' ? 'bg-orange/20 text-orange' : 'bg-white text-orange hover:bg-orange/10'
          }`}
        >
          <Image src="/img/ico-kanban.png" alt="Kanban" width={12} height={12} />
          Kanban
        </button>
      </div>

      {error
        ? <p className="text-sm text-red-500 text-center mt-12">{error}</p>
        : view === 'list' ? <DashboardListView tasks={tasks} /> : <DashboardKanbanView tasks={tasks} />
      }
    </div>
  )
}