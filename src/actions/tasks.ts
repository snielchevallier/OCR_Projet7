'use server'

import { apiFetch } from '@/lib/api'
import type { Task } from '@/types'

export async function getProjectTasksAction(projectId: string): Promise<Task[]> {
  const res = await apiFetch<{ success: boolean; data: { tasks: Task[] } }>(`/projects/${projectId}/tasks`)
  return res.data.tasks
}
