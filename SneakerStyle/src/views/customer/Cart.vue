<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">Giỏ hàng</h2>

    <div v-if="lines.length === 0" class="text-center text-muted py-5">Giỏ hàng trống.</div>

    <div v-else class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <ul class="list-group list-group-flush">
            <li v-for="line in lines" :key="line.productId" class="list-group-item py-3">
              <div class="row align-items-center g-2">
                <div class="col-2 col-md-1">
                  <div class="ratio ratio-1x1 bg-light rounded">
                    <img v-if="line.image" :src="line.image" class="object-fit-cover rounded" alt="" />
                  </div>
                </div>
                <div class="col-6 col-md-5">
                  <div class="fw-semibold">{{ line.name }}</div>
                  <small class="text-muted">{{ line.price.toLocaleString('vi-VN') }}đ / đôi</small>
                </div>
                <div class="col-4 col-md-3">
                  <label class="form-label small mb-0">Số lượng</label>
                  <input
                    v-model.number="line.qty"
                    type="number"
                    min="1"
                    class="form-control form-control-sm"
                    @input="persist"
                  />
                </div>
                <div class="col-12 col-md-2 text-md-end">
                  <div class="fw-bold text-primary">{{ lineTotal(line).toLocaleString('vi-VN') }}đ</div>
                </div>
                <div class="col-12 col-md-1 text-end">
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeLine(line.productId)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Tổng cộng</h5>
          <p class="h4 text-primary mb-3">{{ grandTotal.toLocaleString('vi-VN') }}đ</p>
          <button type="button" class="btn btn-primary w-100" @click="checkout">Thanh toán</button>
          <p class="small text-muted mt-2 mb-0">
            Đơn sẽ ở trạng thái <strong>chờ duyệt</strong> — nhân viên xử lý sau.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storageService } from '@/services/storage'
import { getSessionUser } from '@/services/auth'
import { useToast } from '@/services/toast'

const lines = ref([])
const toast = useToast()

onMounted(() => {
  lines.value = storageService.getCart()
})

function persist() {
  storageService.saveCart(lines.value.filter((l) => l.qty > 0))
  lines.value = storageService.getCart()
}

function lineTotal(line) {
  return line.price * (line.qty || 0)
}

const grandTotal = computed(() => lines.value.reduce((s, l) => s + lineTotal(l), 0))

function removeLine(productId) {
  lines.value = lines.value.filter((l) => l.productId !== productId)
  storageService.saveCart(lines.value)
}

function checkout() {
  if (lines.value.length === 0) return
  const u = getSessionUser()
  const order = {
    customerId: u?.id || null,
    customerName: u?.fullName || 'Khách vãng lai',
    totalAmount: grandTotal.value,
    status: 'pending',
    paymentMethod: 'COD',
    source: 'online',
    items: lines.value.map((l) => ({
      productId: l.productId,
      name: l.name,
      quantity: l.qty,
      price: l.price,
    })),
  }
  storageService.add('orders', order)
  storageService.saveCart([])
  lines.value = []
  toast.show('Đã gửi đơn — vui lòng chờ nhân viên duyệt.')
}
</script>

<style scoped>
.object-fit-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
