import { createRouter, createWebHistory } from 'vue-router'
import { getSessionUser, homePathByRole } from '@/services/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/views/customer/CustomerLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/customer/Home.vue') },
      { path: 'shop', name: 'Shop', component: () => import('@/views/customer/Shop.vue') },
      { path: 'cart', name: 'Cart', component: () => import('@/views/customer/Cart.vue') },
      {
        path: 'profile',
        name: 'CustomerProfile',
        component: () => import('@/views/customer/Profile.vue'),
        meta: { requiresAuth: true, roles: ['customer'] },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'products/create', name: 'ProductCreate', component: () => import('@/views/admin/ProductForm.vue') },
      { path: 'products/:id/edit', name: 'ProductEdit', component: () => import('@/views/admin/ProductForm.vue') },
      { path: 'products', name: 'ProductMgmt', component: () => import('@/views/admin/ProductMgmt.vue') },
      { path: 'orders', name: 'OrderMgmt', component: () => import('@/views/admin/OrderMgmt.vue') },
      { path: 'users', name: 'UserMgmt', component: () => import('@/views/admin/UserMgmt.vue') },
      { path: 'profile', name: 'AdminProfile', component: () => import('@/views/admin/AdminProfile.vue') },
    ],
  },
  {
    path: '/staff',
    component: () => import('@/views/staff/StaffLayout.vue'),
    meta: { requiresAuth: true, roles: ['staff'] },
    redirect: '/staff/pos',
    children: [
      { path: 'pos', name: 'StaffPOS', component: () => import('@/views/staff/SalePage.vue') },
      { path: 'history', name: 'StaffHistory', component: () => import('@/views/staff/HistoryView.vue') },
      { path: 'profile', name: 'StaffProfile', component: () => import('@/views/staff/StaffProfile.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const user = getSessionUser()

  if (to.meta.public && to.path === '/login' && user) {
    return homePathByRole(user.role)
  }

  const needAuth = to.matched.some((r) => r.meta.requiresAuth)
  if (needAuth && !user) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  for (const r of to.matched) {
    const roles = r.meta.roles
    if (roles?.length && user && !roles.includes(user.role)) {
      return homePathByRole(user.role)
    }
  }

  return true
})

export default router
