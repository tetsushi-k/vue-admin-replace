<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrderDetailModal from '../components/OrderDetailModal.vue'
import OrderFilterBar from '../components/OrderFilterBar.vue'
import OrderPagination from '../components/OrderPagination.vue'
import OrderTable from '../components/OrderTable.vue'
import { useOrderStore } from '../stores/orderStore'
import type { Order } from '../types/order'

const store = useOrderStore()
const router = useRouter()
const selectedOrder = ref<Order | null>(null)
const detailVisible = ref(false)

onMounted(async () => {
  store.initAuth()
  if (!store.authenticated) {
    router.push('/login')
    return
  }
  await store.loadOrders()
})

async function onSearch() {
  await store.applyFilters({ page: 1 })
}

async function onPageChange(page: number) {
  await store.changePage(page)
}

async function logout() {
  await store.logout()
  router.push('/login')
}

function onRowClick(order: Order) {
  selectedOrder.value = order
  detailVisible.value = true
}
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>受注一覧（Vue 3）</h1>
      <el-button @click="logout">ログアウト</el-button>
    </header>

    <OrderFilterBar @search="onSearch" />

    <el-alert v-if="store.error" :title="store.error" type="error" show-icon class="mb" />

    <OrderTable
      :orders="store.orders"
      :loading="store.loading"
      :empty="store.isEmpty"
      @row-click="onRowClick"
    />

    <OrderDetailModal v-model="detailVisible" :order="selectedOrder" />

    <OrderPagination :meta="store.meta" @page-change="onPageChange" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.mb {
  margin-bottom: 1rem;
}
</style>
