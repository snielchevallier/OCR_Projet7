import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'
import { getUserInitials, slugify } from '@/lib/utils'

type Props = Project & {
  tasksTotal: number
  tasksCompleted: number
  progress: number
}

export default function ProjectCard({ project }: { project: Props }) {
  const members = project.members ?? []
  const ownerInitials = getUserInitials(project.owner?.name).replace(' ', '')

  return (
    <Link href={`/projets/${slugify(project.name)}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-grey-border p-6 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">

        {/* Titre + description — flex-1 pousse le reste vers le bas */}
        <div className="flex-1 mb-8">
          <h2 className="text-xl font-bold text-black mb-3 leading-snug">
            {project.name}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progression */}
        <div className="flex flex-col gap-1.5 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Progression</span>
            <span className="text-sm font-medium text-black">{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              role="progressbar"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression : ${project.progress}%`}
              className="h-full bg-orange rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {project.tasksCompleted}/{project.tasksTotal} tâches terminées
          </p>
        </div>

        {/* Équipe */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Image src="/img/ico-team.svg" alt="" width={12} height={11} />
            <span>Équipe ({1 + members.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Avatar owner — indépendant */}
            {project.owner && (
              <span className="w-9 h-9 rounded-full bg-orange/20 text-orange text-xs flex items-center justify-center font-semibold shrink-0">
                {ownerInitials}
              </span>
            )}
            {/* Badge rôle — indépendant */}
            {project.owner && (
              <span className="h-9 px-3 py-1 rounded-full bg-orange/20 text-orange text-xs flex items-center justify-center font-semibold whitespace-nowrap">
                Propriétaire
              </span>
            )}
            {/* Avatars membres — superposés */}
            {members.length > 0 && (
              <div className="flex items-center">
                {members.map((m, i) => (
                  <span
                    key={m.id}
                    className={`w-9 h-9 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-semibold shrink-0 border-2 border-white ${i > 0 ? '-ml-3' : ''}`}
                  >
                    {getUserInitials(m.user.name).replace(' ', '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}