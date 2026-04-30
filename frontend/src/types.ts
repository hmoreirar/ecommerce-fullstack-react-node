export type Product = {
  id: number
  name: string
  price: number
  image?: string
  stock?: number
}

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

export type ShippingInfo = {
  address: string
  city: string
  postalCode: string
  phone: string
}

export type Order = {
  id: number
  total: number
  status: string
  created_at: string
  email?: string
}

export type User = {
  id: number
  email: string
  role: 'admin' | 'client'
}
