import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns'

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

export const formatRelativeDate = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export const isExpired = (expiresAt: string): boolean => {
  return isBefore(new Date(expiresAt), new Date())
}

export const isExpiringSoon = (expiresAt: string, hours: number = 24): boolean => {
  const expirationDate = new Date(expiresAt)
  const soonDate = new Date(Date.now() + hours * 60 * 60 * 1000)
  return isBefore(expirationDate, soonDate) && isAfter(expirationDate, new Date())
}

export const getMinDateTime = (): string => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes from now
  return now.toISOString().slice(0, 16)
}