import axios from 'axios'
import type { OrderFilters, PaginatedOrders, User } from '../types/order'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>('/api/login', {
    email,
    password,
  })
  return data
}

export async function logout() {
  await api.post('/api/logout')
}

export async function fetchMe() {
  const { data } = await api.get<User>('/api/me')
  return data
}

export async function fetchOrders(filters: OrderFilters) {
  const params: Record<string, string | number> = {
    page: filters.page,
    per_page: filters.perPage,
  }
  if (filters.status) params.status = filters.status
  if (filters.dateFrom) params.date_from = filters.dateFrom
  if (filters.dateTo) params.date_to = filters.dateTo

  const { data } = await api.get<PaginatedOrders>('/api/admin/orders', { params })
  return data
}

export { api }
