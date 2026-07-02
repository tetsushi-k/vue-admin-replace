import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import OrderFilterBar from '../components/OrderFilterBar.vue'
import { useOrderStore } from '../stores/orderStore'

describe('OrderFilterBar', () => {
  it('updates store status and emits search on submit', async () => {
    setActivePinia(createPinia())
    const store = useOrderStore()

    const wrapper = mount(OrderFilterBar, {
      global: {
        plugins: [ElementPlus],
      },
    })

    store.setFilters({ status: 'paid' })
    await wrapper.vm.$nextTick()

    expect(store.filters.status).toBe('paid')

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})
