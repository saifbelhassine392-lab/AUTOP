export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  stock: number;
  trackStock: boolean;
  images: ProductImage[];
  category: Category;
  brand?: Brand | null;
  specs: ProductSpec[];
  avgRating: number;
  reviewCount: number;
  soldCount: number;
  viewCount: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
  unit?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parent?: Category | null;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  country?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  userId: string;
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PaymentMethod = 'CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: User;
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown> | null;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  customerNote?: string | null;
  adminNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  product?: Product;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';

export interface Quote {
  id: string;
  quoteNumber: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  clientCompany?: string | null;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: Date;
  notes?: string | null;
  terms?: string | null;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  description: string;
  sku?: string | null;
  price: number;
  quantity: number;
  total: number;
  product?: Product | null;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  productId: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  adminReply?: string | null;
  repliedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EngineType = 'ESSENCE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'HYBRID_RECHARGEABLE';
export type FuelType = 'SP95' | 'SP98' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export interface VehicleMake {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  country?: string | null;
}

export interface VehicleModel {
  id: string;
  makeId: string;
  make: VehicleMake;
  name: string;
  slug: string;
}

export interface VehicleGeneration {
  id: string;
  modelId: string;
  name: string;
  yearStart: number;
  yearEnd?: number | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  mobileImage?: string | null;
  link?: string | null;
  linkText?: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
}