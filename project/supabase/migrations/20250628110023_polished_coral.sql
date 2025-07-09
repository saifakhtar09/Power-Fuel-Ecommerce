/*
# Complete E-commerce Database Schema

1. New Tables
   - `profiles` - User profile information
   - `customer_groups` - Customer segmentation
   - `categories` - Product categories
   - `brands` - Product brands
   - `products` - Main product catalog
   - `product_variants` - Product variations (size, flavor, etc.)
   - `inventory` - Stock management
   - `addresses` - User shipping/billing addresses
   - `orders` - Order management
   - `order_items` - Order line items
   - `payment_methods` - Saved payment methods
   - `reviews` - Product reviews
   - `wishlists` - User wishlists
   - `coupons` - Discount coupons
   - `order_tracking` - Order status tracking
   - `loyalty_transactions` - Loyalty points system
   - `referrals` - Referral program
   - `support_tickets` - Customer support
   - `support_messages` - Support ticket messages
   - `return_requests` - Return/refund requests
   - `return_items` - Return line items
   - `affiliates` - Affiliate program
   - `affiliate_commissions` - Affiliate earnings
   - `shipping_zones` - Shipping regions
   - `shipping_rates` - Shipping costs
   - `tax_rates` - Tax calculations
   - `flash_sales` - Limited time offers
   - `bulk_discounts` - Quantity discounts
   - `abandoned_carts` - Cart recovery
   - `analytics_events` - User behavior tracking
   - `seo_settings` - SEO metadata
   - `email_templates` - Email templates
   - `website_settings` - Site configuration

2. Security
   - Enable RLS on all tables
   - Add comprehensive policies for data access
   - User-specific data isolation

3. Functions & Triggers
   - Auto-generate order numbers
   - Update customer statistics
   - Manage inventory
   - Set referral codes
   - Handle timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on tables we're about to recreate
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'profiles', 'customer_groups', 'categories', 'brands', 'products', 
            'product_variants', 'inventory', 'addresses', 'orders', 'order_items',
            'payment_methods', 'reviews', 'wishlists', 'coupons', 'order_tracking',
            'loyalty_transactions', 'referrals', 'support_tickets', 'support_messages',
            'return_requests', 'return_items', 'affiliates', 'affiliate_commissions',
            'shipping_zones', 'shipping_rates', 'tax_rates', 'flash_sales',
            'bulk_discounts', 'abandoned_carts', 'analytics_events', 'seo_settings',
            'email_templates', 'website_settings'
        )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Drop existing triggers if they exist
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
        AND event_object_table IN (
            'profiles', 'addresses', 'orders', 'payment_methods', 'reviews', 'return_requests'
        )
    ) LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', r.trigger_name, r.event_object_table);
    END LOOP;
END $$;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS set_order_number() CASCADE;
DROP FUNCTION IF EXISTS set_referral_code() CASCADE;
DROP FUNCTION IF EXISTS set_return_number() CASCADE;
DROP FUNCTION IF EXISTS update_customer_stats() CASCADE;
DROP FUNCTION IF EXISTS update_inventory() CASCADE;

-- Customer groups table (create first as it's referenced by profiles)
CREATE TABLE IF NOT EXISTS customer_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  discount_percentage decimal(5,2) DEFAULT 0,
  min_order_amount decimal(10,2) DEFAULT 0,
  benefits jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  avatar_url text,
  customer_group_id uuid REFERENCES customer_groups(id),
  total_spent decimal(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  loyalty_points integer DEFAULT 0,
  referral_code text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  website_url text,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  category_id uuid REFERENCES categories(id),
  brand_id uuid REFERENCES brands(id),
  sku text UNIQUE NOT NULL,
  barcode text,
  price decimal(10,2) NOT NULL,
  compare_price decimal(10,2),
  cost_price decimal(10,2),
  weight decimal(8,2),
  dimensions jsonb,
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_digital boolean DEFAULT false,
  requires_shipping boolean DEFAULT true,
  track_inventory boolean DEFAULT true,
  allow_backorder boolean DEFAULT false,
  meta_title text,
  meta_description text,
  meta_keywords text,
  nutrition_facts jsonb,
  ingredients text[],
  allergens text[],
  certifications text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  price decimal(10,2) NOT NULL,
  compare_price decimal(10,2),
  cost_price decimal(10,2),
  weight decimal(8,2),
  barcode text,
  image_url text,
  options jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  location text DEFAULT 'main_warehouse',
  last_restocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK ((product_id IS NOT NULL AND variant_id IS NULL) OR (product_id IS NULL AND variant_id IS NOT NULL))
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('shipping', 'billing')) NOT NULL DEFAULT 'shipping',
  is_default boolean DEFAULT false,
  full_name text NOT NULL,
  phone text,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method text CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay')) NOT NULL,
  payment_intent_id text,
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  shipping_address jsonb NOT NULL,
  billing_address jsonb NOT NULL,
  notes text,
  estimated_delivery_date date,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text,
  flavor text NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('credit_card', 'debit_card', 'paypal')) NOT NULL,
  is_default boolean DEFAULT false,
  card_last_four text,
  card_brand text,
  card_exp_month integer,
  card_exp_year integer,
  stripe_payment_method_id text,
  paypal_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  comment text,
  is_verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text CHECK (type IN ('percentage', 'fixed_amount')) NOT NULL,
  value decimal(10,2) NOT NULL,
  minimum_order_amount decimal(10,2) DEFAULT 0,
  maximum_discount_amount decimal(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Order tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  message text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  type text CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')) NOT NULL,
  points integer NOT NULL,
  description text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referral_code text NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  reward_amount decimal(10,2),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  category text CHECK (category IN ('order', 'product', 'shipping', 'payment', 'return', 'other')) NOT NULL,
  assigned_to text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message text NOT NULL,
  is_internal boolean DEFAULT false,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- Return requests table
CREATE TABLE IF NOT EXISTS return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  return_number text UNIQUE NOT NULL,
  reason text CHECK (reason IN ('defective', 'wrong_item', 'not_as_described', 'changed_mind', 'damaged', 'other')) NOT NULL,
  description text,
  status text CHECK (status IN ('requested', 'approved', 'rejected', 'received', 'processed', 'refunded')) DEFAULT 'requested',
  refund_amount decimal(10,2),
  return_shipping_cost decimal(10,2) DEFAULT 0,
  images text[],
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Return items table
CREATE TABLE IF NOT EXISTS return_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id uuid REFERENCES return_requests(id) ON DELETE CASCADE NOT NULL,
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  reason text,
  condition text CHECK (condition IN ('new', 'used', 'damaged')) DEFAULT 'used',
  created_at timestamptz DEFAULT now()
);

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  affiliate_code text UNIQUE NOT NULL,
  commission_rate decimal(5,2) DEFAULT 5.00,
  status text CHECK (status IN ('pending', 'active', 'suspended', 'terminated')) DEFAULT 'pending',
  total_earnings decimal(10,2) DEFAULT 0,
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  payment_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliate commissions table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  commission_amount decimal(10,2) NOT NULL,
  commission_rate decimal(5,2) NOT NULL,
  status text CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')) DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Shipping zones table
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  countries text[] NOT NULL,
  states text[],
  postal_codes text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Shipping rates table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES shipping_zones(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  rate_type text CHECK (rate_type IN ('flat', 'weight_based', 'price_based', 'free')) NOT NULL,
  rate decimal(10,2) NOT NULL DEFAULT 0,
  min_weight decimal(8,2),
  max_weight decimal(8,2),
  min_price decimal(10,2),
  max_price decimal(10,2),
  estimated_days_min integer,
  estimated_days_max integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tax rates table
CREATE TABLE IF NOT EXISTS tax_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rate decimal(5,2) NOT NULL,
  type text CHECK (type IN ('percentage', 'fixed')) DEFAULT 'percentage',
  countries text[],
  states text[],
  postal_codes text[],
  product_categories text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Flash sales table
CREATE TABLE IF NOT EXISTS flash_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  discount_type text CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  product_ids uuid[],
  category_ids uuid[],
  min_quantity integer DEFAULT 1,
  max_quantity integer,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bulk discounts table
CREATE TABLE IF NOT EXISTS bulk_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL,
  discount_type text CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Abandoned carts table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text,
  email text,
  cart_data jsonb NOT NULL,
  total_amount decimal(10,2),
  recovery_email_sent_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  event_type text NOT NULL,
  event_data jsonb,
  page_url text,
  referrer text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- SEO settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  page_id text,
  title text,
  description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  robots text DEFAULT 'index,follow',
  schema_markup jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  variables jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website settings table
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
DO $$ 
DECLARE
    table_name text;
BEGIN
    FOR table_name IN (
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'profiles', 'customer_groups', 'categories', 'brands', 'products', 
            'product_variants', 'inventory', 'addresses', 'orders', 'order_items',
            'payment_methods', 'reviews', 'wishlists', 'coupons', 'order_tracking',
            'loyalty_transactions', 'referrals', 'support_tickets', 'support_messages',
            'return_requests', 'return_items', 'affiliates', 'affiliate_commissions',
            'shipping_zones', 'shipping_rates', 'tax_rates', 'flash_sales',
            'bulk_discounts', 'abandoned_carts', 'analytics_events', 'seo_settings',
            'email_templates', 'website_settings'
        )
    ) LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

-- Create all policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read categories" ON categories FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read brands" ON brands FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read products" ON products FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read product variants" ON product_variants FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read inventory" ON inventory FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own order items" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items for own orders" ON order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can manage own payment methods" ON payment_methods FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read active coupons" ON coupons FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can read tracking for own orders" ON order_tracking FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_tracking.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can read own loyalty transactions" ON loyalty_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can manage own support tickets" ON support_tickets FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own support messages" ON support_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Users can create support messages" ON support_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);

CREATE POLICY "Users can manage own return requests" ON return_requests FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own affiliate data" ON affiliates FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own commissions" ON affiliate_commissions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_commissions.affiliate_id AND affiliates.user_id = auth.uid())
);

CREATE POLICY "Anyone can read shipping zones" ON shipping_zones FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read shipping rates" ON shipping_rates FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read tax rates" ON tax_rates FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read flash sales" ON flash_sales FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read bulk discounts" ON bulk_discounts FOR SELECT TO authenticated USING (is_active = true);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'PF' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'REF' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL THEN
    NEW.return_number := 'RET' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'delivered') THEN
    UPDATE profiles 
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total_amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- This would update inventory based on order items
  -- Implementation depends on your inventory management needs
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION set_order_number();
CREATE TRIGGER set_referral_code_trigger BEFORE INSERT ON profiles FOR EACH ROW EXECUTE FUNCTION set_referral_code();
CREATE TRIGGER set_return_number_trigger BEFORE INSERT ON return_requests FOR EACH ROW EXECUTE FUNCTION set_return_number();

CREATE TRIGGER update_customer_stats_trigger AFTER INSERT OR UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_customer_stats();
CREATE TRIGGER update_inventory_trigger AFTER INSERT OR UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_inventory();