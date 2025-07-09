/*
  # Add notifications table for order updates

  1. New Tables
    - `notifications` - User notifications
    - `admin_notifications` - Admin notifications

  2. Security
    - Enable RLS on notifications tables
    - Add policies for user access
*/

-- Notifications table for users
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin notifications are only accessible by admin users
-- (You can add admin role checking here if needed)

-- Update orders table to support COD
DO $$ 
BEGIN
  -- Update payment method check constraint to include COD and Indian payment methods
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'orders_payment_method_check'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_payment_method_check;
  END IF;
  
  ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
    CHECK (payment_method IN ('credit_card', 'debit_card', 'upi', 'net_banking', 'cod'));
END $$;