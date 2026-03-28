/**
 * auth.js — phiên đăng nhập (localStorage user_login)
 * Dùng kết hợp Vue Router (beforeEach) để bảo vệ route.
 */
const SESSION_KEY = 'user_login'

export function getSessionUser() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const u = JSON.parse(raw)
    return u && typeof u === 'object' ? u : null
  } catch {
    return null
  }
}

export function setSessionUser(userWithoutPassword) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

/** Đăng nhập: trả về { ok, user } hoặc { ok:false, message } */
export function login(username, password, usersFromStorage) {
  const user = usersFromStorage.find((u) => u.username === username && u.password === password)
  if (!user) {
    return { ok: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' }
  }
  if (user.locked) {
    return { ok: false, message: 'Tài khoản đã bị khóa.' }
  }
  const { password: _p, ...safe } = user
  return { ok: true, user: safe }
}

export function logout() {
  clearSession()
}

/** Đường dẫn mặc định sau khi đăng nhập */
export function homePathByRole(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'staff') return '/staff/pos'
  return '/'
}
