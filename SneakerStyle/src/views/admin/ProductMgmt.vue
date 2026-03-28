<template>
  <div>
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">Sản phẩm &amp; loại hàng</h3>
        <p class="text-muted small mb-0">Danh mục (category) chọn khi thêm / sửa giày</p>
      </div>
      <router-link to="/admin/products/create" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Thêm sản phẩm
      </router-link>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm theo tên…" />
          </div>
          <div class="col-md-4">
            <select v-model="filterCategory" class="form-select">
              <option value="">Tất cả danh mục</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Loại hàng</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Trạng thái</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <img
                  :src="product.image || placeholder"
                  alt=""
                  class="rounded"
                  width="50"
                  height="50"
                  style="object-fit: cover"
                />
              </td>
              <td>
                <div class="fw-bold">{{ product.name }}</div>
                <small class="text-muted">#{{ product.id }}</small>
              </td>
              <td>{{ product.category }}</td>
              <td>{{ product.price.toLocaleString('vi-VN') }}đ</td>
              <td>{{ product.stock }}</td>
              <td>
                <span
                  :class="[
                    'badge rounded-pill px-3',
                    product.status === 'active' ? 'bg-status-active' : 'bg-status-muted',
                  ]"
                >
                  {{ product.status === 'active' ? 'Đang bán' : 'Tạm ẩn' }}
                </span>
              </td>
              <td class="text-end">
                <router-link :to="'/admin/products/' + product.id + '/edit'" class="btn btn-sm btn-outline-primary me-1">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDelete(product.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">Không có dữ liệu.</td>
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

const placeholder = 'https://via.placeholder.com/50?text=+'
const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const filterCategory = ref('')

function loadData() {
  products.value = storageService.get('products')
  categories.value = storageService.get('categories')
}

onMounted(loadData)

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return products.value.filter((p) => {
    const okName = !q || p.name.toLowerCase().includes(q)
    const okCat = !filterCategory.value || p.category === filterCategory.value
    return okName && okCat
  })
})

function confirmDelete(id) {
  if (confirm('Xóa sản phẩm này?')) {
    storageService.remove('products', id)
    loadData()
  }
}
</script>
