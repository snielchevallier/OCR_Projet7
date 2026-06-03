import type { ProjectUser } from './project'

export type TaskAssignee = {
  id: string
  userId: string
  user: ProjectUser
}

export type Task = {
  id: string
  projectId: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | null
  dueDate: string | null
  assignees: TaskAssignee[]
  _count?: { comments: number }
}
