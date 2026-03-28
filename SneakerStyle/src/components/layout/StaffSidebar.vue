<template>
  <div class="staff-sidebar vh-100 p-3 border-end bg-white shadow-sm">
    <div class="fw-bold text-secondary mb-1">Staff</div>
    <small class="text-muted d-block mb-3">SneakerStyle</small>
    <hr class="my-2" />
    <ul class="nav nav-pills flex-column gap-1">
      <li class="nav-item">
        <router-link to="/staff/pos" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-clipboard-check me-2"></i>Duyệt đơn hàng
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/staff/history" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-clock-history me-2"></i>Lịch sử bán
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/staff/profile" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-person me-2"></i>Hồ sơ
        </router-link>
      </li>
    </ul>
    <hr class="my-3" />
    <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="out">Đăng xuất</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { clearSession } from '@/services/auth'

const router = useRouter()

function out() {
  clearSession()
  router.push('/login')
}
</script>

<style scoped>
.staff-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 220px;
}
.nav-link.active {
  background-color: #6c757d !important;
  color: #fff !important;
}
</style>
