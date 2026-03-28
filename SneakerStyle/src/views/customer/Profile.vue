<template>
  <div class="container py-4" style="max-width: 640px">
    <h2 class="fw-bold mb-3">Hồ sơ khách hàng</h2>
    <div class="card border-0 shadow-sm p-4">
      <p><strong>Họ tên:</strong> {{ user.fullName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> @{{ user.username }}</p>
      <hr />
      <p class="small text-muted mb-3">Xóa tài khoản sẽ gỡ user khỏi localStorage (demo).</p>
      <button type="button" class="btn btn-outline-danger" @click="handleDeleteAccount">Xóa tài khoản</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionUser, clearSession } from '@/services/auth'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const router = useRouter()
const toast = useToast()
const user = ref({})

onMounted(() => {
  user.value = getSessionUser() || {}
})

function handleDeleteAccount() {
  if (!confirm('Chắc chắn xóa tài khoản?')) return
  const id = user.value.id
  if (!id) return
  storageService.remove('users', id)
  clearSession()
  toast.show('Đã xóa tài khoản.')
  router.push('/')
}
</script>
