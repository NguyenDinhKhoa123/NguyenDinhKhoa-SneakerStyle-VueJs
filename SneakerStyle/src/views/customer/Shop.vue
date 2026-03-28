<template>
  <div class="container py-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <h2 class="fw-bold mb-0">Cửa hàng</h2>
      <div class="d-flex flex-wrap gap-2">
        <button
          type="button"
          class="btn btn-sm rounded-pill"
          :class="filterCat === '' ? 'btn-primary' : 'btn-light border'"
          @click="filterCat = ''"
        >
          Tất cả
        </button>
        <button
          v-for="c in categories"
          :key="c.id"
          type="button"
          class="btn btn-sm rounded-pill"
          :class="filterCat === c.name ? 'btn-primary' : 'btn-light border'"
          @click="filterCat = c.name"
        >
          {{ c.name }}
        </button>
      </div>
    </div>

    <div class="row g-4">
      <div v-for="p in filteredProducts" :key="p.id" class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="ratio ratio-1x1 bg-light">
            <img v-if="p.image" :src="p.image" :alt="p.name" class="object-fit-cover" />
            <div v-else class="d-flex align-items-center justify-content-center text-muted">
              <i class="bi bi-image fs-1"></i>
            </div>
          </div>
          <div class="card-body p-3">
            <small class="text-muted text-uppercase">{{ p.category }}</small>
            <h6 class="fw-bold text-dark mt-1 text-truncate">{{ p.name }}</h6>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="fw-bold text-primary">{{ p.price.toLocaleString('vi-VN') }}đ</span>
              <button type="button" class="btn btn-primary btn-sm" @click="addToCart(p)">Thêm giỏ</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="filteredProducts.length === 0" class="text-center text-muted py-5">Không có sản phẩm.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const products = ref([])
const categories = ref([])
const filterCat = ref('')
const toast = useToast()

onMounted(() => {
  products.value = storageService.get('products').filter((p) => p.status === 'active')
  categories.value = storageService.get('categories')
})

const filteredProducts = computed(() => {
  if (!filterCat.value) return products.value
  return products.value.filter((p) => p.category === filterCat.value)
})

function addToCart(p) {
  const cart = storageService.getCart()
  const found = cart.find((l) => l.productId === p.id)
  if (found) {
    found.qty += 1
  } else {
    cart.push({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image || '',
      qty: 1,
    })
  }
  storageService.saveCart(cart)
  toast.show('Đã thêm vào giỏ hàng.')
}
</script>

<style scoped>
.object-fit-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
