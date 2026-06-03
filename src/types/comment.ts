import type { ProjectUser } from './project'

export type Comment = {
  id: string
  content: string
  createdAt: string
  taskId: string
  author: ProjectUser
}