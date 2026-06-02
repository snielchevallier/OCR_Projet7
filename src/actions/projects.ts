'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api'

type ProjectUser = {
  id: string
  email: string
  name: string
}

export type TeamMember = {
  id: string
  role: string
  userId: string
  projectId: string
  user: ProjectUser
}

export type Project = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: ProjectUser
  members?: TeamMember[]
  _count: {
    tasks: number
  }
  userRole: string
}

export async function getProjectsAction(): Promise<Project[]> {
  const res = await apiFetch<{ success: boolean; data: { projects: Project[] } }>('/projects')
  return res.data.projects
}

type Task = {
  id: string
  status: string
}

export async function getProjectTasksAction(projectId: string): Promise<Task[]> {
  const res = await apiFetch<{ success: boolean; data: { tasks: Task[] } }>(`/projects/${projectId}/tasks`)
  return res.data.tasks
}

export async function createProjectAction(data: { name: string; description: string }) {
  const res = await apiFetch<{ success: boolean; data: { project: Project } }>('/projects', {
    method: 'POST',
    body: data,
  })
  revalidatePath('/projets')
  return res.data.project
}