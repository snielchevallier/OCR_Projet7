export function getUserInitials(name?: string | null): string {
  if (!name) return '?'
  const firstSpaceIndex = name.indexOf(' ')
  const firstName = firstSpaceIndex >= 0 ? name.slice(0, firstSpaceIndex) : name
  const lastName = firstSpaceIndex >= 0 ? name.slice(firstSpaceIndex + 1) : ''
  return firstName.slice(0, 1).toUpperCase() + ' ' + lastName.slice(0, 1).toUpperCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}
