<script setup lang="ts">
import type { Order } from '../types/order'

defineProps<{
  orders: Order[]
  loading: boolean
  empty: boolean
}>()

const emit = defineEmits<{
  'row-click': [order: Order]
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
  <div v-loading="loading" class="order-table-wrap">
    <el-empty v-if="empty" description="受注データがありません" />
    <el-table v-else :data="orders" stripe style="width: 100%" @row-click="(row: Order) => emit('row-click', row)">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="customer_name" label="顧客名" min-width="160" />
      <el-table-column label="金額" min-width="120">
        <template #default="{ row }">{{ formatAmount(row.amount) }}</template>
      </el-table-column>
      <el-table-column label="ステータス" width="140">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ordered_at" label="注文日時" min-width="180" />
    </el-table>
  </div>
</template>

<style scoped>
.order-table-wrap {
  min-height: 200px;
}
</style>
