<template>
  <div>
    <div class="mb-4 d-flex align-items-center gap-3">
      <button type="button" class="btn btn-link text-dark p-0" @click="router.back()">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <div>
        <h3 class="fw-bold mb-0">{{ isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h3>
        <p class="text-muted small mb-0">Chọn <strong>loại hàng (category)</strong> từ danh sách</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm p-4">
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Tên <span class="text-danger">*</span></label>
                <input v-model="product.name" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Danh mục / loại hàng</label>
                <select v-model="product.category" class="form-select" required>
                  <option value="">— Chọn —</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Thương hiệu</label>
                <input v-model="product.brand" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Giá (VNĐ)</label>
                <input v-model.number="product.price" type="number" min="0" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Kho</label>
                <input v-model.number="product.stock" type="number" min="0" class="form-control" required />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold d-block">Trạng thái</label>
                <div class="form-check form-check-inline">
                  <input id="st-a" v-model="product.status" class="form-check-input" type="radio" value="active" />
                  <label class="form-check-label" for="st-a">Đang bán</label>
                </div>
                <div class="form-check form-check-inline">
                  <input id="st-h" v-model="product.status" class="form-check-input" type="radio" value="hidden" />
                  <label class="form-check-label" for="st-h">Tạm ẩn</label>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Mô tả</label>
                <textarea v-model="product.description" class="form-control" rows="3"></textarea>
              </div>
              <div class="col-12 pt-3 border-top d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light" @click="router.back()">Hủy</button>
                <button type="submit" class="btn btn-primary px-4 fw-semibold">Lưu</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Ảnh sản phẩm</h5>
          <div
            class="mb-3 rounded border bg-light d-flex align-items-center justify-content-center overflow-hidden"
            style="min-height: 180px; max-height: 240px"
          >
            <img
              v-if="product.image"
              :src="product.image"
              alt="Xem trước"
              class="w-100 h-100 object-fit-contain p-2"
              style="max-height: 240px"
            />
            <span v-else class="text-muted small px-3 py-5 text-center">Chưa chọn ảnh</span>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            class="form-control form-control-sm"
            accept="image/jpeg,image/png,image/gif,image/webp"
            @change="onImagePick"
          />
          <p class="small text-muted mt-2 mb-0">
            Chọn file từ ổ cứng (JPEG, PNG, GIF, WebP). Dung lượng nên dưới ~2.5&nbsp;MB để tránh đầy bộ nhớ trình duyệt.
          </p>
          <button
            v-if="product.image"
            type="button"
            class="btn btn-link btn-sm text-danger p-0 mt-2"
            @click="clearImage"
          >
            Gỡ ảnh đã chọn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storageService } from '@/services/storage'
import { useToast } from '@/services/toast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const categories = ref([])
const fileInputRef = ref(null)
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024

const isEdit = computed(() => route.name === 'ProductEdit')

const editId = computed(() => {
  if (!isEdit.value) return null
  const id = route.params.id
  return id != null ? String(id) : null
})

const product = reactive({
  name: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  status: 'active',
  description: '',
  image: '',
  sizes: [],
})

onMounted(() => {
  categories.value = storageService.get('categories')
  if (!isEdit.value) return
  const list = storageService.get('products')
  const found = list.find((p) => String(p.id) === editId.value)
  if (!found) {
    toast.show('Không tìm thấy sản phẩm.', 'error')
    router.push('/admin/products')
    return
  }
  Object.assign(product, {
    name: found.name,
    category: found.category,
    brand: found.brand || '',
    price: found.price,
    stock: found.stock,
    status: found.status,
    description: found.description || '',
    image: found.image || '',
    sizes: found.sizes || [],
  })
})

function onImagePick(e) {
  const input = e.target
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.show('Vui lòng chọn file ảnh.', 'error')
    input.value = ''
    return
  }
  if (file.size > MAX_IMAGE_BYTES) {
    toast.show('Ảnh quá lớn (tối đa khoảng 2.5 MB).', 'error')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    product.image = reader.result
  }
  reader.onerror = () => {
    toast.show('Không đọc được file.', 'error')
    input.value = ''
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  product.image = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function handleSubmit() {
  if (isEdit.value) {
    storageService.update('products', editId.value, { ...product })
    toast.show('Đã cập nhật sản phẩm.')
  } else {
    storageService.add('products', { ...product })
    toast.show('Đã thêm sản phẩm.')
  }
  router.push('/admin/products')
}
</script>
