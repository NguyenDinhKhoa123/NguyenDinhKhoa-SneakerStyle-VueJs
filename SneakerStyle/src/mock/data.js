import nikeAf1 from '../assets/nike_af1.jpg'
import adidasUl from '../assets/adidas_ul.jpg'
import jdr4 from '../assets/jdr4.jpg'
import bannerNike from '../assets/banner_nike.jpg'
import bannerAdidas from '../assets/banner_adidas.jpg'
import bannerPuma from '../assets/banner_puma.jpg'

const initialData = {
  banners: [
    {
      id: 1,
      title: 'Giảm giá cuối tuần',
      subtitle: 'Bộ sưu tập sneaker mới',
      image: bannerNike,
      link: '/shop',
    },
    {
      id: 2,
      title: 'Freeship toàn quốc',
      subtitle: 'Đơn từ 2 triệu',
      image: bannerAdidas,
      link: '/shop',
    },
    {
      id: 3,
      title: 'Thành viên mới -10%',
      subtitle: 'Đăng ký ngay',
      image: bannerPuma,
      link: '/login',
    },
  ],

  products: [
    {
      id: 1,
      name: "Nike Air Force 1 '07",
      price: 2900000,
      image: nikeAf1,
      category: 'Lifestyle',
      brand: 'Nike',
      sizes: [38, 39, 40, 41, 42],
      stock: 15,
      status: 'active',
      description: 'Giày phong cách đường phố.',
      createdAt: '2026-03-20T08:00:00Z',
    },
    {
      id: 2,
      name: 'Adidas Ultraboost Light',
      price: 4500000,
      image: adidasUl,
      category: 'Running',
      brand: 'Adidas',
      sizes: [40, 41, 42, 43],
      stock: 8,
      status: 'active',
      description: 'Giày chạy bộ nhẹ.',
      createdAt: '2026-03-22T10:30:00Z',
    },
    {
      id: 3,
      name: 'Jordan Retro 4',
      price: 5200000,
      image: jdr4,
      category: 'Basketball',
      brand: 'Jordan',
      sizes: [41, 42, 43],
      stock: 5,
      status: 'active',
      description: 'Giày bóng rổ cổ điển.',
      createdAt: '2026-03-25T15:00:00Z',
    },
  ],

  categories: [
    { id: 1, name: 'Lifestyle', slug: 'lifestyle' },
    { id: 2, name: 'Running', slug: 'running' },
    { id: 3, name: 'Basketball', slug: 'basketball' },
  ],

  users: [
    {
      id: 'u1',
      username: 'admin',
      password: '123',
      fullName: 'Nguyễn Đình Khoa',
      role: 'admin',
      email: 'admin@solevibe.com',
      avatar: 'avatar.jpg',
      locked: false,
    },
    {
      id: 'u2',
      username: 'staff',
      password: '123',
      fullName: 'Trần Thị Ngọc',
      role: 'staff',
      email: 'staff@solevibe.com',
      avatar: 'avatar.jpg',
      locked: false,
    },
    {
      id: 'u3',
      username: 'customer',
      password: '123',
      fullName: 'Nguyễn Minh Vũ',
      role: 'customer',
      email: 'khachhang@gmail.com',
      avatar: 'avatar.jpg',
      locked: false,
    },
  ],

  orders: [
    {
      id: 'ORD001',
      customerId: 'u3',
      customerName: 'Lê Khách Hàng',
      totalAmount: 2900000,
      status: 'pending',
      paymentMethod: 'COD',
      items: [
        { productId: 1, name: "Nike Air Force 1 '07", quantity: 1, price: 2900000, size: 41 },
      ],
      createdAt: '2026-03-27T09:00:00Z',
    },
  ],
}

export default initialData
