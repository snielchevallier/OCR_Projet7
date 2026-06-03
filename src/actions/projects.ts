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

export async function deleteProjectAction(id: string) {
  await apiFetch(`/projects/${id}`, { method: 'DELETE' })
  revalidatePath('/projets')
}

export async function updateProjectAction(id: string, data: { name: string; description: string }) {
  const res = await apiFetch<{ success: boolean; data: { project: Project } }>(`/projects/${id}`, {
    method: 'PUT',
    body: data,
  })
  revalidatePath('/projets')
  return res.data.project
}

export async function addContributorAction(projectId: string, email: string) {
  await apiFetch(`/projects/${projectId}/contributors`, {
    method: 'POST',
    body: { email },
  })
  revalidatePath('/projets')
}

export async function removeContributorAction(projectId: string, userId: string) {
  await apiFetch(`/projects/${projectId}/contributors/${userId}`, {
    method: 'DELETE',
  })
  revalidatePath('/projets')
}

export async function searchUsersAction(query: string): Promise<{ id: string; email: string; name: string }[]> {
  const res = await apiFetch<{ success: boolean; data: { users: { id: string; email: string; name: string }[] } }>(
    `/users/search?query=${encodeURIComponent(query)}`
  )
  return res.data.users
}
