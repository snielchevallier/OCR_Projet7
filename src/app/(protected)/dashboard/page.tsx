import { getAssignedTasksAction } from '@/actions/dashboard'
import DashboardContent from '@/app/components/dashboard/DashboardContent'

export default async function Dashboard() {
  let tasks: Awaited<ReturnType<typeof getAssignedTasksAction>> = []
  let error: string | undefined

  try {
    tasks = await getAssignedTasksAction()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erreur de chargement'
  }

  return <DashboardContent tasks={tasks} error={error} />
}