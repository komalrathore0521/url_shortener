import axios from 'axios'

const API_BASE_URL = ' https://url-shortener-5nmj.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface ShortenRequest {
  originalUrl: string
  customAlias?: string
  expirationDate?: string
  expiresInDays?: number
}

export interface UrlResponse {
  id: number
  originalUrl: string
  shortUrl: string
  fullShortUrl: string
  createdAt: string
  expiresAt: string
  clickCount: number
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),

  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
}

export const urlApi = {
  shortenUrl: (data: ShortenRequest) =>
    api.post<UrlResponse>('/urls/shorten', data),

  getUserUrls: () =>
    api.get<UrlResponse[]>('/urls/my-urls'),

  deleteUrl: (shortUrl: string) =>
    api.delete(`/urls/${shortUrl}`),
}

export default api