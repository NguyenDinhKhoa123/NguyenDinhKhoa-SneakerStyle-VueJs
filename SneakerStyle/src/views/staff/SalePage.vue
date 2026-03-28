<template>
  <div>
    <h3 class="fw-bold mb-2">Duyệt đơn hàng</h3>
    <p class="text-muted small mb-4">
      Khách thanh toán trên web → đơn ở trạng thái <strong>Chờ duyệt</strong>. Nhân viên duyệt, giao và hoàn thành tại đây.
    </p>

    <!-- Đơn chờ duyệt -->
    <h5 class="fw-bold mb-3">Đơn chờ duyệt</h5>
    <div class="card border-0 shadow-sm mb-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th>Sản phẩm</th>
              <th class="text-end">Tổng</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in pendingOrders" :key="o.id">
              <td class="fw-semibold">#{{ o.id }}</td>
              <td>
                <div>{{ o.customerName }}</div>
                <small class="text-muted">{{ o.paymentMethod }}</small>
              </td>
              <td class="small">{{ itemsSummary(o) }}</td>
              <td class="text-end fw-semibold">{{ o.totalAmount.toLocaleString('vi-VN') }}đ</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-sm btn-success me-1" @click="approve(o)">Duyệt</button>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="reject(o)">Hủy</button>
              </td>
            </tr>
            <tr v-if="pendingOrders.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Không có đơn chờ duyệt.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Đơn đang giao -->
    <h5 class="fw-bold mb-3">Đơn đang giao</h5>
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th>Sản phẩm</th>
              <th class="text-end">Tổng</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in shippingOrders" :key="o.id">
              <td class="fw-semibold">#{{ o.id }}</td>
              <td>{{ o.customerName }}</td>
              <td class="small">{{ itemsSummary(o) }}</td>
              <td class="text-end">{{ o.totalAmount.toLocaleString('vi-VN') }}đ</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-sm btn-primary me-1" @click="complete(o)">Hoàn thành</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="cancelShipping(o)">Hủy &amp; hoàn kho</button>
              </td>
            </tr>
            <tr v-if="shippingOrders.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Không có đơn đang giao.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const orders = ref([])
const products = ref([])
const toast = useToast()

function load() {
  orders.value = storageService.get('orders')
  products.value = storageService.get('products')
}

onMounted(load)

const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'pending'))
const shippingOrders = computed(() => orders.value.filter((o) => o.status === 'shipping'))

function itemsSummary(o) {
  if (!o.items?.length) return '—'
  return o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')
}

function stockOk(o) {
  for (const item of o.items || []) {
    const p = products.value.find((x) => x.id == item.productId)
    if (!p || p.stock < item.quantity) return false
  }
  return true
}

function deductStock(o) {
  for (const item of o.items || []) {
    const p = products.value.find((x) => x.id == item.productId)
    if (p) {
      storageService.update('products', p.id, { stock: p.stock - item.quantity })
    }
  }
}

function restoreStock(o) {
  for (const item of o.items || []) {
    const p = products.value.find((x) => x.id == item.productId)
    if (p) {
      storageService.update('products', p.id, { stock: p.stock + item.quantity })
    }
  }
}

function approve(o) {
  if (!stockOk(o)) {
    toast.show('Kho không đủ hàng để duyệt đơn này.', 'error')
    return
  }
  deductStock(o)
  storageService.update('orders', o.id, { status: 'shipping' })
  toast.show('Đã duyệt đơn — chuyển sang đang giao.')
  load()
}

function reject(o) {
  if (!confirm('Hủy đơn này?')) return
  storageService.update('orders', o.id, { status: 'cancelled' })
  toast.show('Đã hủy đơn.')
  load()
}

function complete(o) {
  storageService.update('orders', o.id, { status: 'completed' })
  toast.show('Đã hoàn thành đơn.')
  load()
}

function cancelShipping(o) {
  if (!confirm('Hủy đơn và hoàn lại số lượng vào kho?')) return
  restoreStock(o)
  storageService.update('orders', o.id, { status: 'cancelled' })
  toast.show('Đã hủy đơn và hoàn kho.')
  load()
}
</script>
