import type { Task } from '@/types'

export const STATUS_LABEL: Record<Task['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
}

export const STATUS_STYLE: Record<Task['status'], string> = {
  TODO: 'bg-orange/20 text-orange',
  IN_PROGRESS: 'bg-blue-100 text-blue-600',
  DONE: 'bg-green-100 text-green-700',
}