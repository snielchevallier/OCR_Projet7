'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api'
import type { Task } from '@/types'

export async function getProjectTasksAction(projectId: string): Promise<Task[]> {
  const res = await apiFetch<{ success: boolean; data: { tasks: Task[] } }>(`/projects/${projectId}/tasks`)
  return res.data.tasks
}

export async function updateTaskAction(
  projectId: string,
  taskId: string,
  data: {
    title: string
    description: string
    dueDate: string
    status: Task['status']
    priority?: Task['priority']
    assigneeIds?: string[]
  }
) {
  const res = await apiFetch<{ success: boolean; data: { task: Task } }>(
    `/projects/${projectId}/tasks/${taskId}`,
    { method: 'PUT', body: data }
  )
  revalidatePath('/projets', 'layout')
  return res.data.task
}

export async function deleteTaskAction(projectId: string, taskId: string) {
  await apiFetch(`/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE' })
  revalidatePath('/projets', 'layout')
}

export async function createTaskAction(
  projectId: string,
  data: {
    title: string
    description: string
    dueDate: string
    priority?: Task['priority']
    assigneeIds?: string[]
  }
) {
  console.log('Creating task with data:', data)
  const res = await apiFetch<{ success: boolean; data: { task: Task } }>(
    `/projects/${projectId}/tasks`,
    { method: 'POST', body: data }
  )
  revalidatePath('/projets', 'layout')
  return res.data.task
}
