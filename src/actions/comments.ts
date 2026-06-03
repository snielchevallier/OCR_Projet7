'use server'

import { apiFetch } from '@/lib/api'
import type { Comment } from '@/types'

export async function getTaskCommentsAction(projectId: string, taskId: string): Promise<Comment[]> {
  const res = await apiFetch<{ success: boolean; data: { comments: Comment[] } }>(
    `/projects/${projectId}/tasks/${taskId}/comments`
  )
  return res.data.comments
}

export async function createCommentAction(projectId: string, taskId: string, content: string): Promise<Comment> {
  const res = await apiFetch<{ success: boolean; data: { comment: Comment } }>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    { method: 'POST', body: { content } }
  )
  return res.data.comment
}
