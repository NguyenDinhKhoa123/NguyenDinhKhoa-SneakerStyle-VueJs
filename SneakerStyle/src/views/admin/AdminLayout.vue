<template>
  <div class="d-flex">
    <Sidebar />
    <div class="admin-main flex-grow-1">
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
        <div class="container-fluid">
          <span class="navbar-brand fw-bold text-primary mb-0">Khu vực Admin</span>
          <div class="d-flex align-items-center">
            <span class="me-3 text-muted small">
              Xin chào, <strong class="text-dark">{{ user.fullName || '…' }}</strong>
            </span>
            <span class="badge rounded-pill px-3 py-2 bg-primary">{{ (user.role || '').toUpperCase() }}</span>
          </div>
        </div>
      </nav>
      <div class="p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { getSessionUser } from '@/services/auth'

const user = ref({})

onMounted(() => {
  user.value = getSessionUser() || {}
})
</script>

<style scoped>
.admin-main {
  margin-left: 250px;
  min-height: 100vh;
  background-color: var(--ss-bg, #f3f4f6);
}
</style>
