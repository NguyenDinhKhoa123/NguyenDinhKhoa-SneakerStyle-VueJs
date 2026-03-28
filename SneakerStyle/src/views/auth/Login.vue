<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-sm login-card">
      <div class="card-body p-4 p-md-5">
        <h2 class="text-center fw-bold mb-4 text-primary">Đăng nhập</h2>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập</label>
            <input v-model="form.username" type="text" class="form-control" required autocomplete="username" />
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 small text-center mb-3">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold py-2" :disabled="loading">
            {{ loading ? 'Đang xử lý…' : 'Đăng nhập' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storageService } from '@/services/storage'
import { login, setSessionUser, homePathByRole } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const form = reactive({ username: '', password: '' })

function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  setTimeout(() => {
    const users = storageService.get('users')
    const result = login(form.username, form.password, users)

    if (!result.ok) {
      errorMessage.value = result.message
      loading.value = false
      return
    }

    setSessionUser(result.user)
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      router.push(redirect)
    } else {
      router.push(homePathByRole(result.user.role))
    }
    loading.value = false
  }, 400)
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(160deg, #f3f4f6 0%, #e5e7eb 40%, #fff 100%);
}
.login-card {
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--ss-border, #e5e7eb);
  border-radius: 16px;
  border-top: 4px solid var(--ss-orange, #f97316);
}
</style>
