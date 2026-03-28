<template>
  <div class="d-flex">
    <StaffSidebar />
    <div class="staff-main flex-grow-1">
      <nav class="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
        <span class="navbar-brand fw-bold text-secondary mb-0">Nhân viên bán hàng</span>
        <span class="small text-muted">Xin chào, <strong>{{ user.fullName || '…' }}</strong></span>
      </nav>
      <div class="p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StaffSidebar from '@/components/layout/StaffSidebar.vue'
import { getSessionUser } from '@/services/auth'

const user = ref({})

onMounted(() => {
  user.value = getSessionUser() || {}
})
</script>

<style scoped>
.staff-main {
  margin-left: 220px;
  min-height: 100vh;
  background-color: var(--ss-bg, #f3f4f6);
}
</style>
