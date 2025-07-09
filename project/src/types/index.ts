export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  flavors: string[];
  sizes: ProductSize[];
  nutrition: NutritionInfo;
  rating: number;
  reviews: number;
}

export interface ProductSize {
  size: string;
  servings: number;
  price: number;
}

export interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  sugar: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  flavor: string;
  size: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar_url?: string;
  total_spent?: number;
  total_orders?: number;
  loyalty_points?: number;
  referral_code?: string;
  customer_group_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  is_default: boolean;
  full_name: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cod';
  payment_intent_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  estimated_delivery_date?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  tracking?: OrderTracking[];
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  flavor: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'debit_card' | 'paypal';
  is_default: boolean;
  card_last_four?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  stripe_payment_method_id?: string;
  paypal_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user_profile?: Profile;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
}

export interface OrderTracking {
  id: string;
  order_id: string;
  status: string;
  message?: string;
  location?: string;
  created_at: string;
}

export interface CheckoutData {
  items: CartItem[];
  shipping_address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  billing_address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description?: string;
  expires_at?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'cancelled';
  reward_amount?: number;
  order_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  order_id?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order' | 'product' | 'shipping' | 'payment' | 'return' | 'other';
  assigned_to?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  return_number: string;
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'damaged' | 'other';
  description?: string;
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'processed' | 'refunded';
  refund_amount?: number;
  return_shipping_cost: number;
  images?: string[];
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  total_earnings: number;
  total_clicks: number;
  total_conversions: number;
  payment_details?: any;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  type: 'order_placed' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'payment_failed' | 'refund_processed' | 'promotional';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}