<script setup lang="ts">
import type { Order } from '../types/order'

defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const statusType = (status: Order['status']) => {
  const map = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    cancelled: 'danger',
  } as const
  return map[status]
}

const formatAmount = (amount: number) => `¥${amount.toLocaleString()}`
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="受注詳細"
    width="480px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <dl v-if="order" class="detail-list">
      <div class="detail-row">
        <dt>ID</dt>
        <dd>{{ order.id }}</dd>
      </div>
      <div class="detail-row">
        <dt>顧客名</dt>
        <dd>{{ order.customer_name }}</dd>
      </div>
      <div class="detail-row">
        <dt>金額</dt>
        <dd>{{ formatAmount(order.amount) }}</dd>
      </div>
      <div class="detail-row">
        <dt>ステータス</dt>
        <dd>
          <el-tag :type="statusType(order.status)">{{ order.status }}</el-tag>
        </dd>
      </div>
      <div class="detail-row">
        <dt>注文日時</dt>
        <dd>{{ order.ordered_at }}</dd>
      </div>
    </dl>
  </el-dialog>
</template>

<style scoped>
.detail-list {
  margin: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row dt {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-weight: normal;
}

.detail-row dd {
  margin: 0;
}
</style>
