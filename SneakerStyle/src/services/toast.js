import { reactive } from 'vue'

export const toastState = reactive({
  messages: [],
})

/** Gọi toast.show('Nội dung') hoặc toast.show('Lỗi', 'error') */
export function useToast() {
  function show(text, type = 'success', duration = 3000) {
    const id = Date.now()
    toastState.messages.push({ id, text, type })
    setTimeout(() => {
      toastState.messages = toastState.messages.filter((m) => m.id !== id)
    }, duration)
  }
  return { show }
}

export function removeToast(id) {
  toastState.messages = toastState.messages.filter((m) => m.id !== id)
}
