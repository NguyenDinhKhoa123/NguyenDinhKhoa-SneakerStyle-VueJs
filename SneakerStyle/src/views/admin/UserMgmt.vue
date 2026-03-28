<template>
  <div>
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">
          <i class="bi bi-people-fill me-2 text-primary"></i>
          Quản lý tài khoản
        </h3>
        <p class="text-muted small mb-0">Thêm / khóa / đổi quyền (Staff — Customer)</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="showAdd = true">
        <i class="bi bi-person-plus me-1"></i>Thêm tài khoản
      </button>
    </div>

    <div class="mb-3 d-flex flex-wrap gap-2">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        type="button"
        class="btn btn-sm rounded-pill"
        :class="roleFilter === opt.value ? 'btn-primary' : 'btn-light border'"
        @click="roleFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th class="text-center">Vai trò</th>
              <th class="text-center">Khóa</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>
                <div class="fw-semibold">{{ u.fullName }}</div>
                <small class="text-muted">@{{ u.username }}</small>
                <span v-if="u.locked" class="badge bg-danger ms-1">Đã khóa</span>
              </td>
              <td class="small text-muted">{{ u.email }}</td>
              <td class="text-center" style="max-width: 140px">
                <select
                  v-if="u.role !== 'admin'"
                  class="form-select form-select-sm"
                  :value="u.role"
                  @change="changeRole(u.id, $event.target.value)"
                >
                  <option value="staff">staff</option>
                  <option value="customer">customer</option>
                </select>
                <span v-else class="badge bg-danger">admin</span>
              </td>
              <td class="text-center">
                <div v-if="u.role !== 'admin'" class="form-check form-switch d-inline-block">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="u.locked"
                    @change="toggleLock(u.id, $event.target.checked)"
                  />
                </div>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-end">
                <button
                  v-if="u.role !== 'admin' && u.id !== currentId"
                  type="button"
                  class="btn btn-sm btn-outline-danger border-0"
                  @click="removeUser(u.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Thêm user -->
    <div
      v-if="showAdd"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.4)"
      @click.self="showAdd = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tài khoản mới</h5>
            <button type="button" class="btn-close" @click="showAdd = false"></button>
          </div>
          <form @submit.prevent="submitAdd">
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label small">Username</label>
                <input v-model="newUser.username" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label small">Mật khẩu</label>
                <input v-model="newUser.password" type="password" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label small">Họ tên</label>
                <input v-model="newUser.fullName" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label small">Email</label>
                <input v-model="newUser.email" type="email" class="form-control" required />
              </div>
              <div class="mb-0">
                <label class="form-label small">Quyền</label>
                <select v-model="newUser.role" class="form-select">
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" @click="showAdd = false">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storageService } from '@/services/storage'
import { getSessionUser } from '@/services/auth'
import { useToast } from '@/services/toast'

const users = ref([])
const roleFilter = ref('')
const showAdd = ref(false)
const toast = useToast()
const currentId = ref(null)

const newUser = reactive({
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: 'customer',
})

const filterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'customer', label: 'Khách' },
]

function loadUsers() {
  users.value = storageService.get('users')
}

onMounted(() => {
  loadUsers()
  const me = getSessionUser()
  currentId.value = me?.id
})

const filteredUsers = computed(() => {
  if (!roleFilter.value) return users.value
  return users.value.filter((u) => u.role === roleFilter.value)
})

function changeRole(id, role) {
  storageService.update('users', id, { role })
  loadUsers()
  toast.show('Đã đổi quyền.')
}

function toggleLock(id, locked) {
  storageService.update('users', id, { locked })
  loadUsers()
  toast.show(locked ? 'Đã khóa tài khoản.' : 'Đã mở khóa.')
}

function removeUser(id) {
  if (!confirm('Xóa user này?')) return
  storageService.remove('users', id)
  loadUsers()
  toast.show('Đã xóa.')
}

function submitAdd() {
  storageService.add('users', {
    username: newUser.username,
    password: newUser.password,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
    locked: false,
    avatar: 'avatar-user.png',
  })
  showAdd.value = false
  newUser.username = ''
  newUser.password = ''
  newUser.fullName = ''
  newUser.email = ''
  newUser.role = 'customer'
  loadUsers()
  toast.show('Đã thêm tài khoản.')
}
</script>
