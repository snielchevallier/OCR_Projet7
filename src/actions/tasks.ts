'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api'
import type { Task } from '@/types'

export async function getProjectTasksAction(projectId: string): Promise<Task[]> {
  const res = await apiFetch<{ success: boolean; data: { tasks: Task[] } }>(`/projects/${projectId}/tasks`)
  return res.data.tasks
}

export async function createTaskAction(
  projectId: string,
  data: {
    title: string
    description: string
    dueDate: string
    status: Task['status']
    assigneeIds?: string[]
  }
) {
  const res = await apiFetch<{ success: boolean; data: { task: Task } }>(
    `/projects/${projectId}/tasks`,
    { method: 'POST', body: data }
  )
  revalidatePath('/projets', 'layout')
  return res.data.task
}
