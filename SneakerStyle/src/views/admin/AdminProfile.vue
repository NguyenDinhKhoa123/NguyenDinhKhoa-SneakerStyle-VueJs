<template>
  <div>
    <h3 class="fw-bold text-dark mb-1">Hồ sơ quản trị</h3>
    <p class="text-muted small mb-4">Đổi mật khẩu (demo localStorage)</p>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-4">
          <img
            :src="'https://i.pravatar.cc/120?u=' + encodeURIComponent(user.id || 'admin')"
            alt=""
            class="rounded-circle mx-auto mb-3"
            width="96"
            height="96"
          />
          <h5 class="fw-bold mb-1">{{ user.fullName }}</h5>
          <span class="badge bg-primary">{{ (user.role || '').toUpperCase() }}</span>
          <hr class="my-3" />
          <p class="small text-start mb-1"><strong>Email:</strong> {{ user.email }}</p>
          <p class="small text-start mb-0"><strong>Username:</strong> @{{ user.username }}</p>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card border-0 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Đổi mật khẩu</h5>
          <form @submit.prevent="updatePassword">
            <div class="mb-3">
              <label class="form-label small fw-semibold">Mật khẩu mới</label>
              <input v-model="pass.new" type="password" class="form-control" required minlength="3" />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-semibold">Nhập lại</label>
              <input v-model="pass.confirm" type="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSessionUser } from '@/services/auth'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const user = ref({})
const pass = reactive({ new: '', confirm: '' })
const toast = useToast()

onMounted(() => {
  user.value = getSessionUser() || {}
})

function updatePassword() {
  if (pass.new !== pass.confirm) {
    toast.show('Hai ô mật khẩu không giống nhau.', 'error')
    return
  }
  const ok = storageService.update('users', user.value.id, { password: pass.new })
  if (!ok) {
    toast.show('Không tìm thấy user.', 'error')
    return
  }
  toast.show('Đã đổi mật khẩu.')
  pass.new = ''
  pass.confirm = ''
}
</script>
