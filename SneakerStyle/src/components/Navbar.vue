<template>
  <nav class="navbar navbar-expand-lg navbar-dark shadow-sm py-2" style="background-color: var(--ss-orange)">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">SneakerStyle</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMain"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navMain" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active fw-bold">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shop" active-class="active fw-bold">Cửa hàng</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart" active-class="active fw-bold">Giỏ hàng</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <template v-if="!user">
            <router-link to="/login" class="btn btn-outline-light btn-sm">Đăng nhập</router-link>
          </template>
          <template v-else>
            <span class="text-white-50 small d-none d-md-inline">Xin chào, {{ user.fullName }}</span>
            <router-link v-if="user.role === 'customer'" to="/profile" class="btn btn-light btn-sm">Hồ sơ</router-link>
            <router-link v-if="user.role === 'admin'" to="/admin/dashboard" class="btn btn-light btn-sm">Admin</router-link>
            <router-link v-if="user.role === 'staff'" to="/staff/pos" class="btn btn-light btn-sm">Duyệt đơn</router-link>
            <button type="button" class="btn btn-outline-light btn-sm" @click="doLogout">Thoát</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionUser, clearSession } from '@/services/auth'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  user.value = getSessionUser()
})

function doLogout() {
  clearSession()
  user.value = null
  router.push('/')
}
</script>
