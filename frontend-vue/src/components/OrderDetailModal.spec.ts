import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderDetailModal from '../components/OrderDetailModal.vue'
import type { Order } from '../types/order'

const sampleOrder: Order = {
  id: 42,
  user_id: 1,
  customer_name: '山田太郎',
  amount: 12000,
  status: 'pending',
  ordered_at: '2026-07-01 12:00:00',
}

describe('OrderDetailModal', () => {
  it('displays order fields when open', () => {
    const wrapper = mount(OrderDetailModal, {
      props: {
        modelValue: true,
        order: sampleOrder,
      },
      global: {
        stubs: {
          ElDialog: {
            props: ['modelValue', 'title'],
            template: '<div v-if="modelValue" class="dialog"><slot /></div>',
          },
          ElTag: { template: '<span><slot /></span>' },
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('42')
    expect(text).toContain('山田太郎')
    expect(text).toContain('¥12,000')
    expect(text).toContain('pending')
    expect(text).toContain('2026-07-01 12:00:00')
  })

  it('emits update:modelValue when dialog closes', async () => {
    const wrapper = mount(OrderDetailModal, {
      props: {
        modelValue: true,
        order: sampleOrder,
      },
      global: {
        stubs: {
          ElDialog: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div class="dialog" @click="$emit(\'update:modelValue\', false)"><slot /></div>',
          },
          ElTag: true,
        },
      },
    })

    await wrapper.find('.dialog').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})
