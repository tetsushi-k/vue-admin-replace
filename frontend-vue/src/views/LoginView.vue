<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'

const store = useOrderStore()
const router = useRouter()
const email = ref('admin@example.com')
const password = ref('password123')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await store.login(email.value, password.value)
    router.push('/orders')
  } catch {
    error.value = 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <h2>ログイン（Vue 3）</h2>
      </template>
      <el-form @submit.prevent="onSubmit">
        <el-form-item label="メール">
          <el-input v-model="email" type="email" autocomplete="username" />
        </el-form-item>
        <el-form-item label="パスワード">
          <el-input v-model="password" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" show-icon class="mb" />
        <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
          ログイン
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.login-card {
  width: 420px;
}

.mb {
  margin-bottom: 1rem;
}
</style>
