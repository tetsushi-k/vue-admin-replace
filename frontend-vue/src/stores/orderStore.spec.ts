import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from '../stores/orderStore'
import * as client from '../api/client'

vi.mock('../api/client', () => ({
  fetchOrders: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  setAuthToken: vi.fn(),
}))

describe('orderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('loads orders and toggles loading state', async () => {
    const store = useOrderStore()
    store.token = 'test-token'
    store.authenticated = true

    vi.mocked(client.fetchOrders).mockResolvedValue({
      data: [
        {
          id: 1,
          user_id: 1,
          customer_name: 'テスト太郎',
          amount: 3000,
          status: 'paid',
          ordered_at: '2026-07-01 10:00:00',
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 1,
      },
      links: {},
    })

    const promise = store.loadOrders()
    expect(store.loading).toBe(true)

    await promise

    expect(store.loading).toBe(false)
    expect(store.orders).toHaveLength(1)
    expect(store.meta?.total).toBe(1)
  })

  it('sets error when API fails', async () => {
    const store = useOrderStore()
    store.token = 'test-token'

    vi.mocked(client.fetchOrders).mockRejectedValue(new Error('network'))

    await store.loadOrders()

    expect(store.error).toBe('受注一覧の取得に失敗しました')
    expect(store.orders).toEqual([])
  })

  it('migrates legacy vue_token to admin_token', () => {
    localStorage.setItem('vue_token', 'migrated-token')

    const store = useOrderStore()

    expect(store.token).toBe('migrated-token')
    expect(localStorage.getItem('admin_token')).toBe('migrated-token')
    expect(localStorage.getItem('vue_token')).toBeNull()
    expect(store.authenticated).toBe(true)
  })
})
