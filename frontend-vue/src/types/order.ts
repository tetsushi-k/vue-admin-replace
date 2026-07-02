export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Order {
  id: number
  user_id: number
  customer_name: string
  amount: number
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  ordered_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedOrders {
  data: Order[]
  meta: PaginationMeta
  links: Record<string, string | null>
}

export interface OrderFilters {
  status: string
  dateFrom: string
  dateTo: string
  page: number
  perPage: number
}
