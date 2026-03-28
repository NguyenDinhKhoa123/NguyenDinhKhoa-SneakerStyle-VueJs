<template>
  <div class="sidebar vh-100 p-3 shadow-sm">
    <div class="brand-mark mb-2 text-center fw-bold">SneakerStyle</div>
    <p class="text-muted small text-center mb-3">Admin — màu cam chủ đạo</p>
    <hr class="border-secondary opacity-25 my-3" />
    <ul class="nav nav-pills flex-column mb-auto gap-1">
      <li class="nav-item">
        <router-link to="/admin/dashboard" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-speedometer2 me-2"></i>Thống kê
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/products" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-box-seam me-2"></i>Sản phẩm &amp; loại hàng
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/orders" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-receipt me-2"></i>Lịch sử bán hàng
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/users" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-people me-2"></i>Quản lý user
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/profile" class="nav-link rounded-3 text-secondary" active-class="active fw-semibold">
          <i class="bi bi-person-circle me-2"></i>Hồ sơ
        </router-link>
      </li>
    </ul>
    <hr class="border-secondary opacity-25 my-3" />
    <button type="button" class="btn btn-outline-danger w-100 btn-sm rounded-3" @click="handleLogout">
      <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { clearSession } from '@/services/auth'

const router = useRouter()

function handleLogout() {
  clearSession()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  background: var(--ss-surface, #fff);
  border-right: 1px solid var(--ss-border, #e5e7eb);
}

.brand-mark {
  color: var(--ss-orange, #f97316);
  font-size: 1.15rem;
}

.nav-link {
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #374151 !important;
}

.nav-link.active {
  background-color: var(--ss-orange, #f97316) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
}
</style>
