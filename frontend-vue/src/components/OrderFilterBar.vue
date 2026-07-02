<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '../stores/orderStore'

const emit = defineEmits<{
  search: []
}>()

const store = useOrderStore()

const status = computed({
  get: () => store.filters.status,
  set: (value: string) => store.setFilters({ status: value }),
})

const dateRange = computed({
  get: () => {
    const from = store.filters.dateFrom
    const to = store.filters.dateTo
    if (!from && !to) return null
    return [from || '', to || ''] as [string, string]
  },
  set: (value: [string, string] | null) => {
    store.setFilters({
      dateFrom: value?.[0] ?? '',
      dateTo: value?.[1] ?? '',
    })
  },
})

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: 'pending', value: 'pending' },
  { label: 'paid', value: 'paid' },
  { label: 'shipped', value: 'shipped' },
  { label: 'cancelled', value: 'cancelled' },
]

function onSearch() {
  emit('search')
}
</script>

<template>
  <el-form inline class="filter-bar" @submit.prevent="onSearch">
    <el-form-item label="ステータス">
      <el-select v-model="status" placeholder="すべて" style="width: 160px">
        <el-option
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="注文日">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="〜"
        start-placeholder="開始日"
        end-placeholder="終了日"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">検索</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 1rem;
}
</style>
