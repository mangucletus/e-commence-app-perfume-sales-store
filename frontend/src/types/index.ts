export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  category: 'MEN' | 'WOMEN' | 'UNISEX';
  size: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  brand: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  brand: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  shippingAddress: string;
  items: OrderItem[];
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}
