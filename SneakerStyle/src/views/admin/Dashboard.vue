<template>
  <div>
    <div class="mb-4">
      <h3 class="fw-bold text-dark mb-1">Thống kê</h3>
      <p class="text-muted small mb-0">Tổng quan doanh thu &amp; đơn hàng </p>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100 border-start border-4 border-primary">
          <div class="card-body">
            <div class="text-muted small">Tổng đơn</div>
            <div class="h4 fw-bold mb-0">{{ totalOrders }}</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100 border-start border-4 border-success">
          <div class="card-body">
            <div class="text-muted small">Tổng thu (tất cả đơn)</div>
            <div class="h5 fw-bold mb-0 text-success">{{ revenue.toLocaleString('vi-VN') }}đ</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100 border-start border-4 border-info">
          <div class="card-body">
            <div class="text-muted small">Sản phẩm</div>
            <div class="h4 fw-bold mb-0">{{ totalProducts }}</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100 border-start border-4 border-warning">
          <div class="card-body">
            <div class="text-muted small">Khách hàng</div>
            <div class="h4 fw-bold mb-0">{{ totalCustomers }}</div>
          </div>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 fw-bold py-3">
            <i class="bi bi-exclamation-triangle text-danger me-2"></i>
            Sắp hết hàng (&lt; 10)
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="p in lowStockProducts"
              :key="p.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{{ p.name }}</span>
              <span class="badge bg-danger-subtle text-danger">Còn {{ p.stock }}</span>
            </li>
            <li v-if="lowStockProducts.length === 0" class="list-group-item text-muted text-center py-3">
              Không có sản phẩm.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storageService } from '@/services/storage'

const products = ref([])
const orders = ref([])
const users = ref([])

onMounted(() => {
  products.value = storageService.get('products')
  orders.value = storageService.get('orders')
  users.value = storageService.get('users')
})

const totalProducts = computed(() => products.value.length)
const totalOrders = computed(() => orders.value.length)
const totalCustomers = computed(() => users.value.filter((u) => u.role === 'customer').length)

const revenue = computed(() => orders.value.reduce((sum, o) => sum + o.totalAmount, 0))

const lastFourOrders = computed(() => {
  return [...orders.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
})

const chartBars = computed(() => {
  const list = lastFourOrders.value
  if (!list.length) return []
  const max = Math.max(...list.map((o) => o.totalAmount), 1)
  return list.map((o) => Math.round((o.totalAmount / max) * 100))
})

const lowStockProducts = computed(() => products.value.filter((p) => p.stock < 10).slice(0, 8))
</script>
