<script setup lang="ts">
import type { PaginationMeta } from '../types/order'

const props = defineProps<{
  meta: PaginationMeta | null
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

function onChange(page: number) {
  emit('page-change', page)
}
</script>

<template>
  <div v-if="meta" class="pagination-wrap">
    <el-pagination
      background
      layout="prev, pager, next, total"
      :current-page="meta.current_page"
      :page-size="meta.per_page"
      :total="meta.total"
      @current-change="onChange"
    />
  </div>
</template>

<style scoped>
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
