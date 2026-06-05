import { getAssignedTasksAction } from '@/actions/dashboard'
import DashboardContent from '@/app/components/dashboard/DashboardContent'

export default async function Dashboard() {
  const tasks = await getAssignedTasksAction().catch(() => [])

  return <DashboardContent tasks={tasks} />
}