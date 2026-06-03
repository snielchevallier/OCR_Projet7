'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api'
import type { Project } from '@/types'

export async function getProjectsAction(): Promise<Project[]> {
  const res = await apiFetch<{ success: boolean; data: { projects: Project[] } }>('/projects')
  return res.data.projects
}

export async function getProjectAction(projectId: string): Promise<Project> {
  const res = await apiFetch<{ success: boolean; data: { project: Project } }>(`/projects/${projectId}`)
  return res.data.project
}

export async function createProjectAction(data: { name: string; description: string; contributors?: string[] }) {
  const res = await apiFetch<{ success: boolean; data: { project: Project } }>('/projects', {
    method: 'POST',
    body: data,
  })
  revalidatePath('/projets')
  return res.data.project
}

export async function searchUsersAction(query: string): Promise<{ id: string; email: string; name: string }[]> {
  const res = await apiFetch<{ success: boolean; data: { users: { id: string; email: string; name: string }[] } }>(
    `/users/search?query=${encodeURIComponent(query)}`
  )
  return res.data.users
}
