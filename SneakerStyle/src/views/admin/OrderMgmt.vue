<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="fw-bold text-dark mb-1">
          <i class="bi bi-receipt me-2 text-primary"></i>
          Lịch sử bán hàng
        </h3>
        <p class="text-muted small mb-0">Chỉ xem và CRUD đơn. Cập nhật trạng thái do nhân viên xử lý.</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="openAdd">
        <i class="bi bi-plus-lg me-1"></i>Thêm đơn
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th class="text-center">Tổng</th>
              <th class="text-center">Ngày</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="fw-semibold text-primary">#{{ order.id }}</td>
              <td>
                <div class="fw-semibold">{{ order.customerName }}</div>
                <small class="text-muted">{{ order.paymentMethod }}</small>
              </td>
              <td class="text-center">{{ order.totalAmount.toLocaleString('vi-VN') }}đ</td>
              <td class="text-center text-muted small">{{ formatDate(order.createdAt) }}</td>
              <td class="text-center">
                <span class="badge rounded-pill px-3" :class="statusClass(order.status)">
                  {{ statusText(order.status) }}
                </span>
              </td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="openEdit(order)">Sửa</button>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="removeOrder(order.id)">Xóa</button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">Chưa có đơn.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm -->
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
            <h5 class="modal-title">Thêm đơn</h5>
            <button type="button" class="btn-close" @click="showAdd = false"></button>
          </div>
          <form @submit.prevent="saveAdd">
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label small">Tên khách</label>
                <input v-model="addForm.customerName" type="text" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label small">Tổng tiền (VNĐ)</label>
                <input v-model.number="addForm.totalAmount" type="number" min="0" class="form-control" required />
              </div>
              <div class="mb-0">
                <label class="form-label small">Thanh toán</label>
                <select v-model="addForm.paymentMethod" class="form-select">
                  <option value="COD">COD</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" @click="showAdd = false">Đóng</button>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal sửa (không chỉnh trạng thái) -->
    <div
      v-if="editTarget"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.4)"
      @click.self="editTarget = null"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sửa đơn #{{ editTarget.id }}</h5>
            <button type="button" class="btn-close" @click="editTarget = null"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label small">Tên khách</label>
              <input v-model="form.customerName" type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label small">Tổng tiền (VNĐ)</label>
              <input v-model.number="form.totalAmount" type="number" min="0" class="form-control" />
            </div>
            <div class="mb-0">
              <label class="form-label small">Thanh toán</label>
              <select v-model="form.paymentMethod" class="form-select">
                <option value="COD">COD</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
              </select>
            </div>
            <p class="small text-muted mt-3 mb-0">Trạng thái đơn không sửa tại đây — nhân viên duyệt trên trang Staff.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="editTarget = null">Đóng</button>
            <button type="button" class="btn btn-primary" @click="saveEdit">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const orders = ref([])
const editTarget = ref(null)
const showAdd = ref(false)
const form = reactive({
  customerName: '',
  totalAmount: 0,
  paymentMethod: 'COD',
})
const addForm = reactive({
  customerName: '',
  totalAmount: 0,
  paymentMethod: 'COD',
})
const toast = useToast()

function loadOrders() {
  orders.value = storageService.get('orders')
}

onMounted(loadOrders)

function formatDate(s) {
  return new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

const statusLabels = {
  pending: 'Chờ duyệt',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

function statusText(status) {
  return statusLabels[status] || status
}

function statusClass(status) {
  const map = {
    pending: 'bg-warning text-dark',
    shipping: 'bg-info text-dark',
    completed: 'bg-success',
    cancelled: 'bg-danger',
  }
  return map[status] || 'bg-secondary'
}

function openAdd() {
  addForm.customerName = ''
  addForm.totalAmount = 0
  addForm.paymentMethod = 'COD'
  showAdd.value = true
}

function saveAdd() {
  storageService.add('orders', {
    customerName: addForm.customerName,
    totalAmount: addForm.totalAmount,
    paymentMethod: addForm.paymentMethod,
    status: 'pending',
    items: [],
  })
  showAdd.value = false
  toast.show('Đã thêm đơn (chờ duyệt).')
  loadOrders()
}

function openEdit(order) {
  editTarget.value = order
  form.customerName = order.customerName
  form.totalAmount = order.totalAmount
  form.paymentMethod = order.paymentMethod
}

function saveEdit() {
  if (!editTarget.value) return
  storageService.update('orders', editTarget.value.id, {
    customerName: form.customerName,
    totalAmount: form.totalAmount,
    paymentMethod: form.paymentMethod,
  })
  toast.show('Đã cập nhật đơn.')
  editTarget.value = null
  loadOrders()
}

function removeOrder(id) {
  if (!confirm('Xóa đơn này khỏi dữ liệu?')) return
  storageService.remove('orders', id)
  toast.show('Đã xóa.')
  loadOrders()
}
</script>
