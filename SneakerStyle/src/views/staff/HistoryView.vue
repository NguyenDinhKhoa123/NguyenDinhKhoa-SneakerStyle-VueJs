<template>
  <div>
    <h3 class="fw-bold mb-3">Lịch sử bán hàng</h3>
    <p class="text-muted small mb-4">Chỉ xem danh sách (không sửa / xóa).</p>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th class="text-end">Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id">
              <td class="fw-semibold">#{{ o.id }}</td>
              <td>{{ o.customerName }}</td>
              <td class="text-end">{{ o.totalAmount.toLocaleString('vi-VN') }}đ</td>
              <td>
                <span class="badge bg-secondary">{{ o.status }}</span>
              </td>
              <td class="small text-muted">{{ formatDate(o.createdAt) }}</td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Chưa có đơn.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storageService } from '@/services/storage'

const orders = ref([])

onMounted(() => {
  orders.value = [...storageService.get('orders')].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

function formatDate(s) {
  return new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}
</script>
