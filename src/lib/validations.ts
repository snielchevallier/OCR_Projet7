const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(email: string, password: string): string | null {
  if (!email || !password) return 'Tous les champs sont requis'
  return null
}

export function validateRegister(lastname: string, firstname: string, email: string, password: string): string | null {
  if (!lastname || !firstname || !email || !password) return 'Tous les champs sont requis'
  if (!EMAIL_REGEX.test(email)) return "Format d'email invalide"
  if (!PASSWORD_REGEX.test(password)) return 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)'
  return null
}

export function validateProject(name: string, description: string): string | null {
  if (!name.trim()) return 'Le nom du projet est requis'
  if (name.trim().length < 2) return 'Le nom du projet doit contenir au moins 2 caractères'
  if (name.trim().length > 100) return 'Le nom du projet ne peut pas dépasser 100 caractères'
  if (description.trim().length > 500) return 'La description ne peut pas dépasser 500 caractères'
  return null
}

export function validateTask(title: string, description: string, dueDate: string): string | null {
  if (!title.trim()) return 'Le titre de la tâche est requis'
  if (title.trim().length < 2) return 'Le titre de la tâche doit contenir au moins 2 caractères'
  if (title.trim().length > 200) return 'Le titre de la tâche ne peut pas dépasser 200 caractères'
  if (description.trim().length > 1000) return 'La description ne peut pas dépasser 1000 caractères'
  if (!dueDate) return "La date d'échéance est requise"
  if (isNaN(new Date(dueDate).getTime())) return 'Format de date invalide'
  return null
}
