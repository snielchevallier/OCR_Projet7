export type ProjectUser = {
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
