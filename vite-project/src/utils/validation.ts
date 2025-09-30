export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return url.startsWith('http://') || url.startsWith('https://')
  } catch {
    return false
  }
}

export const validateAlias = (alias: string): string | null => {
  if (!alias) return null

  if (alias.length < 3) {
    return 'Alias must be at least 3 characters long'
  }

  if (alias.length > 20) {
    return 'Alias must be no more than 20 characters long'
  }

  if (!/^[a-zA-Z0-9]+$/.test(alias)) {
    return 'Alias can only contain letters and numbers'
  }

  return null
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

export const validatePassword = (password: string): string[] => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  return errors
}