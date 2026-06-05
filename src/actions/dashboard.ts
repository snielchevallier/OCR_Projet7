'use server'

import { apiFetch } from '@/lib/api'
import type { Task, ProjectUser } from '@/types'

type DashboardComment = {
  id: string
  content: string
  createdAt: string
  author: ProjectUser
}

export type DashboardTask = Omit<Task, '_count'> & {
  project: { id: string; name: string; description: string }
  comments: DashboardComment[]
}

export async function getAssignedTasksAction(): Promise<DashboardTask[]> {
  const res = await apiFetch<{ success: boolean; data: { tasks: DashboardTask[] } }>('/dashboard/assigned-tasks')
  return res.data.tasks
}