import initialData from '../mock/data.js'

const DB_KEY = 'sneakerstyle_db_v4'
const CART_KEY = 'sneakerstyle_cart'

function readDb() {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const storageService = {
  init() {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(initialData))
      return
    }
    const data = readDb()
    if (data && !data.banners?.length) {
      data.banners = initialData.banners
      localStorage.setItem(DB_KEY, JSON.stringify(data))
    }
  },

  get(collectionName) {
    const data = readDb()
    if (!data || !data[collectionName]) return []
    return data[collectionName]
  },

  add(collectionName, item) {
    const data = readDb()
    if (!data || !Array.isArray(data[collectionName])) return null

    const newItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    data[collectionName].push(newItem)
    localStorage.setItem(DB_KEY, JSON.stringify(data))
    return newItem
  },

  update(collectionName, id, updatedItem) {
    const data = readDb()
    if (!data || !Array.isArray(data[collectionName])) return false

    const index = data[collectionName].findIndex((i) => i.id == id)
    if (index === -1) return false

    data[collectionName][index] = {
      ...data[collectionName][index],
      ...updatedItem,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(DB_KEY, JSON.stringify(data))
    return true
  },

  remove(collectionName, id) {
    const data = readDb()
    if (!data || !Array.isArray(data[collectionName])) return

    data[collectionName] = data[collectionName].filter((i) => i.id != id)
    localStorage.setItem(DB_KEY, JSON.stringify(data))
  },

  /** Giỏ hàng (JSON riêng, không nằm trong DB chính) */
  getCart() {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  },

  saveCart(lines) {
    localStorage.setItem(CART_KEY, JSON.stringify(lines))
  },
}
