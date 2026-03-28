<template>
  <footer class="border-top py-4 mt-auto bg-white text-center text-muted small">
    <div class="container">
      <p class="mb-1 fw-semibold text-dark">Nguyễn Đình Khoa-SneakerStyle</p>
      <p class="mb-0">© {{ year }} FPT-Polytechnic</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
