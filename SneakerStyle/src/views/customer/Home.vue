<template>
  <div>
    <!-- Slider banner: v-for danh sách + v-if ảnh đang hiện -->
    <section v-if="banners.length" class="position-relative bg-dark">
      <div class="ratio ratio-21x9" style="max-height: 420px">
        <img
          v-if="currentBanner"
          :key="currentBanner.id"
          :src="currentBanner.image"
          :alt="currentBanner.title"
          class="w-100 h-100 object-fit-cover"
        />
      </div>
      <div class="position-absolute bottom-0 start-0 end-0 p-4 text-white" style="background: linear-gradient(transparent, rgba(0,0,0,0.75))">
        <div class="container">
          <h1 class="fw-bold display-6 mb-1">{{ currentBanner.title }}</h1>
          <p class="mb-3 opacity-90">{{ currentBanner.subtitle }}</p>
          <router-link v-if="currentBanner.link" :to="currentBanner.link" class="btn btn-primary btn-sm">
            Xem thêm
          </router-link>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-light btn-sm position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle"
        aria-label="Trước"
        @click="prev"
      >
        ‹
      </button>
      <button
        type="button"
        class="btn btn-light btn-sm position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
        aria-label="Sau"
        @click="next"
      >
        ›
      </button>
      <div class="position-absolute bottom-2 start-50 translate-middle-x d-flex gap-1 pb-2">
        <button
          v-for="(b, i) in banners"
          :key="b.id"
          type="button"
          class="rounded-circle border-0 p-0"
          :class="i === index ? 'bg-primary' : 'bg-white opacity-50'"
          style="width: 10px; height: 10px"
          :aria-label="'Banner ' + (i + 1)"
          @click="index = i"
        />
      </div>
    </section>

    <div v-else class="py-5 text-center text-muted">Chưa có banner.</div>

    <div class="container py-5">
      <h2 class="fw-bold mb-3">Danh mục nổi bật</h2>
      <div class="row g-3">
        <div v-for="c in categories" :key="c.id" class="col-6 col-md-4">
          <router-link
            to="/shop"
            class="card h-100 border-0 shadow-sm text-decoration-none text-dark p-3 text-center"
          >
            <i class="bi bi-tag-fill text-primary fs-3 mb-2"></i>
            <div class="fw-semibold">{{ c.name }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storageService } from '@/services/storage'

const banners = ref([])
const categories = ref([])
const index = ref(0)
let timer = null

const currentBanner = computed(() => banners.value[index.value] || null)

onMounted(() => {
  banners.value = storageService.get('banners')
  categories.value = storageService.get('categories')
  timer = setInterval(() => {
    if (!banners.value.length) return
    index.value = (index.value + 1) % banners.value.length
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function next() {
  if (!banners.value.length) return
  index.value = (index.value + 1) % banners.value.length
}

function prev() {
  if (!banners.value.length) return
  index.value = (index.value - 1 + banners.value.length) % banners.value.length
}
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
.bottom-2 {
  bottom: 0.5rem;
}
</style>
