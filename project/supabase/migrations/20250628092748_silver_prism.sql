/*
  # Complete Production-Ready Ecommerce Schema

  1. New Tables
    - `categories` - Product categories
    - `brands` - Product brands
    - `inventory` - Stock management
    - `shipping_zones` - Shipping configuration
    - `tax_rates` - Tax configuration
    - `analytics` - Business analytics
    - `seo_settings` - SEO optimization
    - `email_templates` - Email customization
    - `loyalty_program` - Customer loyalty
    - `referrals` - Referral system
    - `abandoned_carts` - Cart recovery
    - `product_variants` - Product variations
    - `bulk_discounts` - Quantity discounts
    - `flash_sales` - Limited time offers
    - `customer_support` - Support tickets
    - `return_requests` - Return management
    - `affiliate_program` - Affiliate marketing

  2. Complete Business Features
    - Multi-vendor support
    - Advanced inventory management
    - Dynamic pricing
    - SEO optimization
    - Analytics dashboard
    - Customer loyalty program
    - Affiliate marketing
    - Return/refund management
    - Customer support system
*/

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

-- Products table (enhanced)
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
  options jsonb NOT NULL, -- {flavor: "chocolate", size: "2kg"}
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
  CONSTRAINT inventory_product_or_variant CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
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

-- Customer groups table
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

-- Update profiles table to include customer group
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'customer_group_id') THEN
    ALTER TABLE profiles ADD COLUMN customer_group_id uuid REFERENCES customer_groups(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_spent') THEN
    ALTER TABLE profiles ADD COLUMN total_spent decimal(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_orders') THEN
    ALTER TABLE profiles ADD COLUMN total_orders integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'loyalty_points') THEN
    ALTER TABLE profiles ADD COLUMN loyalty_points integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_code') THEN
    ALTER TABLE profiles ADD COLUMN referral_code text UNIQUE;
  END IF;
END $$;

-- Loyalty program table
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

-- Customer support tickets
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

-- Support ticket messages
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

-- Affiliate program
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

-- Affiliate commissions
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

-- Analytics tables
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

-- SEO settings
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

-- Email templates
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

-- Website settings
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog data
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read brands" ON brands FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read products" ON products FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read product variants" ON product_variants FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read inventory" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read shipping zones" ON shipping_zones FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read shipping rates" ON shipping_rates FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read tax rates" ON tax_rates FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read flash sales" ON flash_sales FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can read bulk discounts" ON bulk_discounts FOR SELECT TO authenticated USING (is_active = true);

-- User-specific policies
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

-- Insert default data
INSERT INTO customer_groups (name, description, discount_percentage) VALUES
('Regular', 'Regular customers', 0),
('VIP', 'VIP customers with 5% discount', 5),
('Wholesale', 'Wholesale customers with 15% discount', 15)
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, description) VALUES
('Protein Powders', 'protein-powders', 'High-quality protein supplements'),
('Mass Gainers', 'mass-gainers', 'Weight and muscle gain supplements'),
('Pre-Workout', 'pre-workout', 'Energy and performance boosters'),
('Vitamins', 'vitamins', 'Essential vitamins and minerals'),
('Accessories', 'accessories', 'Fitness accessories and gear')
ON CONFLICT DO NOTHING;

INSERT INTO brands (name, slug, description) VALUES
('PowerFuel', 'powerfuel', 'Premium fitness nutrition brand'),
('Elite Nutrition', 'elite-nutrition', 'Professional grade supplements'),
('Natural Gains', 'natural-gains', 'Natural and organic supplements')
ON CONFLICT DO NOTHING;

INSERT INTO shipping_zones (name, countries) VALUES
('India', ARRAY['IN']),
('International', ARRAY['US', 'CA', 'GB', 'AU'])
ON CONFLICT DO NOTHING;

INSERT INTO website_settings (key, value, description, category) VALUES
('site_name', '"PowerFuel"', 'Website name', 'general'),
('site_description', '"Premium protein supplements for serious athletes"', 'Website description', 'general'),
('contact_email', '"support@powerfuel.com"', 'Contact email', 'general'),
('contact_phone', '"+91-9876543210"', 'Contact phone', 'general'),
('currency', '"INR"', 'Default currency', 'general'),
('tax_rate', '18', 'Default tax rate (GST)', 'tax'),
('free_shipping_threshold', '999', 'Free shipping minimum amount', 'shipping'),
('cod_charges', '50', 'Cash on delivery charges', 'shipping'),
('loyalty_points_rate', '1', 'Points earned per rupee spent', 'loyalty'),
('referral_bonus', '100', 'Referral bonus amount', 'referral')
ON CONFLICT (key) DO NOTHING;

INSERT INTO email_templates (name, subject, html_content, text_content) VALUES
('order_confirmation', 'Order Confirmation #{{order_number}}', 
'<h1>Thank you for your order!</h1><p>Your order #{{order_number}} has been confirmed.</p>', 
'Thank you for your order! Your order #{{order_number}} has been confirmed.'),
('order_shipped', 'Your order #{{order_number}} has been shipped', 
'<h1>Your order is on the way!</h1><p>Tracking: {{tracking_number}}</p>', 
'Your order is on the way! Tracking: {{tracking_number}}'),
('welcome_email', 'Welcome to PowerFuel!', 
'<h1>Welcome to PowerFuel!</h1><p>Start your fitness journey with us!</p>', 
'Welcome to PowerFuel! Start your fitness journey with us!')
ON CONFLICT (name) DO NOTHING;

-- Functions for business logic
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
BEGIN
  RETURN 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_return_number()
RETURNS text AS $$
BEGIN
  RETURN 'RET' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral codes
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Trigger to auto-generate return numbers
CREATE OR REPLACE FUNCTION set_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL THEN
    NEW.return_number := generate_return_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_return_number_trigger
  BEFORE INSERT ON return_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_return_number();

-- Function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.payment_status = 'paid' THEN
    UPDATE profiles 
    SET 
      total_spent = total_spent + NEW.total_amount,
      total_orders = total_orders + 1,
      loyalty_points = loyalty_points + FLOOR(NEW.total_amount)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Function to handle inventory updates
CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    -- Reduce inventory for confirmed orders
    FOR item IN 
      SELECT product_id, quantity 
      FROM order_items 
      WHERE order_id = NEW.id
    LOOP
      UPDATE inventory 
      SET quantity = quantity - item.quantity
      WHERE product_id = item.product_id;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory();