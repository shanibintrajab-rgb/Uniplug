export enum ScentType {
  Floral = 'Floral',
  Woody = 'Woody',
  Fresh = 'Fresh',
  Oriental = 'Oriental'
}

export enum ProductCategory {
  TenML = '10ml',
  TwentyML = '20ml',
  ThirtyML = '30ml',
  Refills = 'Refills'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  scentType: ScentType;
  image: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  phoneNumber: string;
  location: string;
  isAdmin: boolean;
  points: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'on-delivery' | 'delivered';
  paymentMethod: 'm-pesa' | 'airtel-money' | 'tigo-pesa' | 'cash';
  location: string;
  createdAt: any;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: 'fresh-student' | 'active-campus' | 'elite-uniplug';
  status: 'active' | 'cancelled' | 'expired';
  startDate: any;
  nextRefillDate?: any;
}

export interface RefillRequest {
  id: string;
  userId: string;
  productId: string;
  size: string;
  price: number;
  status: 'pending' | 'completed';
  createdAt: any;
}
