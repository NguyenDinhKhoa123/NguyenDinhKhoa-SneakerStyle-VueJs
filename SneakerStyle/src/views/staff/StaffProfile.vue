<template>
  <div style="max-width: 520px">
    <h3 class="fw-bold mb-3">Hồ sơ nhân viên</h3>
    <div class="card border-0 shadow-sm p-4">
      <p><strong>Họ tên:</strong> {{ user.fullName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p class="mb-0"><strong>Username:</strong> @{{ user.username }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSessionUser } from '@/services/auth'

const user = ref({})

onMounted(() => {
  user.value = getSessionUser() || {}
})
</script>
