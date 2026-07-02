import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderTable from '../components/OrderTable.vue'
import type { Order } from '../types/order'

const sampleOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    customer_name: '山田太郎',
    amount: 12000,
    status: 'pending',
    ordered_at: '2026-07-01 12:00:00',
  },
]

describe('OrderTable', () => {
  it('renders order rows from props', () => {
    const wrapper = mount(OrderTable, {
      props: {
        orders: sampleOrders,
        loading: false,
        empty: false,
      },
      global: {
        stubs: {
          ElTable: {
            props: ['data'],
            template: '<div class="table"><div v-for="row in data" :key="row.id">{{ row.customer_name }} {{ row.status }}</div></div>',
          },
          ElTableColumn: true,
          ElTag: { template: '<span><slot /></span>' },
          ElEmpty: true,
        },
      },
    })

    expect(wrapper.text()).toContain('山田太郎')
    expect(wrapper.text()).toContain('pending')
  })

  it('shows empty state when orders are empty', () => {
    const wrapper = mount(OrderTable, {
      props: {
        orders: [],
        loading: false,
        empty: true,
      },
      global: {
        stubs: {
          ElTable: true,
          ElTableColumn: true,
          ElTag: true,
          ElEmpty: { template: '<div>受注データがありません</div>' },
        },
      },
    })

    expect(wrapper.text()).toContain('受注データがありません')
  })
})
