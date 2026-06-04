import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectsAction, getProjectAction } from '@/actions/projects'
import { getProjectTasksAction } from '@/actions/tasks'
import { slugify, getUserInitials } from '@/lib/utils'
import TasksList from '@/app/components/task/TasksList'
import EditProjectModal from '@/app/components/modales/project/edit'
import DeleteProjectButton from '@/app/components/modales/project/delete'
import NewTaskModal from '@/app/components/modales/task/new'

export default async function ProjetDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let projects
  try {
    projects = await getProjectsAction()
  } catch {
    notFound()
  }

  const found = projects.find(p => slugify(p.name) === slug)
  if (!found) notFound()

  const [project, tasks] = await Promise.all([
    getProjectAction(found.id).catch(() => found),
    getProjectTasksAction(found.id).catch(() => []),
  ])

  const members = project.members ?? []
  const ownerInitials = getUserInitials(project.owner?.name).replace(' ', '')

  return (
    <div className="w-full max-w-303 mx-auto my-8 px-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div className="flex items-start gap-4">
          <Link
            href="/projets"
            className="mt-1 text-gray-400 hover:text-black transition-colors"
            aria-label="Retour aux projets"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-black">{project.name}</h1>
              <EditProjectModal project={project} />
              <DeleteProjectButton project={project} />
            </div>
            <p className="text-sm text-gray-500 max-w-xl">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <NewTaskModal project={project} />
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-medium rounded-lg hover:bg-orange/80 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
            </svg>
            IA
          </button>
        </div>
      </div>

      {/* Contributors */}
      <div className="flex items-center gap-4 mb-6 px-5 py-4 bg-white rounded-2xl border border-grey-border flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black">Contributeurs</span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            {1 + members.length} personnes
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {project.owner && (
            <>
              <span className="w-8 h-8 rounded-full bg-orange/20 text-orange text-xs flex items-center justify-center font-semibold shrink-0">
                {ownerInitials}
              </span>
              <span className="px-3 py-1 bg-orange/20 text-orange text-xs rounded-full font-medium">
                Propriétaire
              </span>
            </>
          )}
          {members.map(m => {
            const initials = getUserInitials(m.user?.name).replace(' ', '')
            return (
              <div key={m.id} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                  {initials}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {m.user?.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tasks */}
      <TasksList tasks={tasks} project={project} />
    </div>
  )
}
