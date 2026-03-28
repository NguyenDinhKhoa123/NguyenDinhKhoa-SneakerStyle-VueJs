<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
    <div
      v-for="msg in toastState.messages"
      :key="msg.id"
      class="toast show align-items-center border-0 shadow mb-2"
      :class="msg.type === 'error' ? 'toast-ss-error' : 'toast-ss-success'"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body text-white fw-semibold">
          <i
            class="bi me-2"
            :class="msg.type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'"
          />
          {{ msg.text }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Đóng"
          @click="removeToast(msg.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { toastState, removeToast } from '@/services/toast'
</script>
