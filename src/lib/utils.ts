export function getUserInitials(name?: string | null): string {
  if (!name) return '?'
  const firstSpaceIndex = name.indexOf(' ')
  const firstName = firstSpaceIndex >= 0 ? name.slice(0, firstSpaceIndex) : name
  const lastName = firstSpaceIndex >= 0 ? name.slice(firstSpaceIndex + 1) : ''
  return firstName.slice(0, 1).toUpperCase() + ' ' + lastName.slice(0, 1).toUpperCase()
}
