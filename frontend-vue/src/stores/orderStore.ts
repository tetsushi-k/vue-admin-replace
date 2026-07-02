import { defineStore } from 'pinia'
import { fetchOrders, login as apiLogin, logout as apiLogout, setAuthToken } from '../api/client'
import type { Order, OrderFilters, PaginationMeta } from '../types/order'

const TOKEN_KEY = 'vue_token'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) as string | null,
    orders: [] as Order[],
    meta: null as PaginationMeta | null,
    filters: {
      status: '',
      dateFrom: '',
      dateTo: '',
      page: 1,
      perPage: 20,
    } as OrderFilters,
    loading: false,
    error: '' as string,
    authenticated: !!localStorage.getItem(TOKEN_KEY),
  }),

  getters: {
    isEmpty: (state) => !state.loading && state.orders.length === 0,
  },

  actions: {
    initAuth() {
      if (this.token) {
        setAuthToken(this.token)
      }
    },

    async login(email: string, password: string) {
      this.error = ''
      const data = await apiLogin(email, password)
      this.token = data.token
      this.authenticated = true
      localStorage.setItem(TOKEN_KEY, data.token)
      setAuthToken(data.token)
    },

    async logout() {
      if (this.token) {
        try {
          await apiLogout()
        } catch {
          // ignore logout errors
        }
      }
      this.token = null
      this.authenticated = false
      this.orders = []
      this.meta = null
      localStorage.removeItem(TOKEN_KEY)
      setAuthToken(null)
    },

    setFilters(partial: Partial<OrderFilters>) {
      this.filters = { ...this.filters, ...partial }
    },

    async loadOrders() {
      if (!this.token) return

      this.loading = true
      this.error = ''
      try {
        const data = await fetchOrders(this.filters)
        this.orders = data.data
        this.meta = data.meta
      } catch {
        this.error = '受注一覧の取得に失敗しました'
        this.orders = []
        this.meta = null
      } finally {
        this.loading = false
      }
    },

    async applyFilters(partial: Partial<OrderFilters>) {
      this.setFilters({ ...partial, page: partial.page ?? 1 })
      await this.loadOrders()
    },

    async changePage(page: number) {
      this.setFilters({ page })
      await this.loadOrders()
    },
  },
})
