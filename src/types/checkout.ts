
export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface PaymentDetails {
  cardNumber?: string;
  nameOnCard?: string;
  expiryDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review';
