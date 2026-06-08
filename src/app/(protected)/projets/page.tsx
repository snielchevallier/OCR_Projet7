import type { Project } from '@/types'
import { getProjectsAction } from '@/actions/projects'
import { getProjectTasksAction } from '@/actions/tasks'
import ProjectCard from '@/app/components/project/ProjectCard'
import NewProjectModal from '@/app/components/modales/project/new'

type ProjectWithProgress = Project & {
  tasksTotal: number
  tasksCompleted: number
  progress: number
}

export default async function Projets() {
  let projects: ProjectWithProgress[] = []
  let error: string | undefined

  try {
    const raw = await getProjectsAction()

    const taskResults = await Promise.all(
      raw.map(p => getProjectTasksAction(p.id).catch(() => []))
    )

    projects = raw.map((project, i) => {
      const tasks = taskResults[i]
      const tasksTotal = tasks.length
      const tasksCompleted = tasks.filter(t => t.status === 'DONE').length
      const progress = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0
      return { ...project, tasksTotal, tasksCompleted, progress }
    })
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erreur de chargement'
  }

  return (
    <div className="w-full max-w-303 flex flex-col mx-auto my-8 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-black">Mes projets</h1>
          <p className="text-base text-gray-500">Gérez vos projets</p>
        </div>
        <div>
          <NewProjectModal />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500 text-center mt-12">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mt-12">Aucun projet pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}