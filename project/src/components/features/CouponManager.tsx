import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Calendar, Percent, DollarSign, Tag, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

const CouponManager: React.FC = () => {
  const { user } = useAuthStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');

  useEffect(() => {
    fetchCoupons();
    if (user) {
      fetchUserCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_usage')
        .select('coupon_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserCoupons(data?.map(usage => usage.coupon_id) || []);
    } catch (error) {
      console.error('Error fetching user coupons:', error);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  const applyCoupon = (code: string) => {
    setAppliedCoupon(code);
    // In a real app, this would be handled by the cart/checkout system
    toast.success(`Coupon "${code}" applied! Use it at checkout.`);
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const isUsageLimitReached = (coupon: Coupon) => {
    return coupon.usage_limit ? coupon.used_count >= coupon.usage_limit : false;
  };

  const hasUserUsed = (couponId: string) => {
    return userCoupons.includes(couponId);
  };

  const canUseCoupon = (coupon: Coupon) => {
    return !isExpired(coupon.valid_until) && 
           !isUsageLimitReached(coupon) && 
           !hasUserUsed(coupon.id);
  };

  const getCouponIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-6 h-6" />;
      case 'fixed_amount':
        return <DollarSign className="w-6 h-6" />;
      case 'free_shipping':
        return <Gift className="w-6 h-6" />;
      default:
        return <Tag className="w-6 h-6" />;
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% OFF`;
      case 'fixed_amount':
        return `₹${coupon.value} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return 'DISCOUNT';
    }
  };

  const getDiscountColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'from-green-500 to-emerald-600';
      case 'fixed_amount':
        return 'from-blue-500 to-cyan-600';
      case 'free_shipping':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Gift className="w-8 h-8 text-primary-500 mr-3" />
          Available Coupons
        </h1>
        <p className="text-gray-600 mt-2">
          Save money on your next order with these exclusive deals!
        </p>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Gift className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No coupons available</h3>
          <p className="text-gray-600">
            Check back later for exciting deals and discounts!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon, index) => {
            const canUse = canUseCoupon(coupon);
            const hasUsed = hasUserUsed(coupon.id);
            const expired = isExpired(coupon.valid_until);
            const limitReached = isUsageLimitReached(coupon);

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
                  !canUse ? 'opacity-60' : 'hover:shadow-xl'
                } transition-shadow duration-300`}
              >
                {/* Coupon Header */}
                <div className={`bg-gradient-to-r ${getDiscountColor(coupon.type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    {getCouponIcon(coupon.type)}
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatDiscount(coupon)}
                      </div>
                      {coupon.maximum_discount_amount && coupon.type === 'percentage' && (
                        <div className="text-sm opacity-90">
                          Max ₹{coupon.maximum_discount_amount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{coupon.title}</h3>
                  <p className="text-sm opacity-90">{coupon.description}</p>
                </div>

                {/* Coupon Body */}
                <div className="p-6">
                  {/* Coupon Code */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                      <span className="font-mono font-bold text-lg text-gray-900">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyCouponCode(coupon.code)}
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                        disabled={!canUse}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Coupon Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Minimum Order:</span>
                      <span className="font-medium">₹{coupon.minimum_order_amount}</span>
                    </div>
                    
                    {coupon.valid_until && (
                      <div className="flex items-center justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">
                          {new Date(coupon.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {coupon.usage_limit && (
                      <div className="flex items-center justify-between">
                        <span>Uses Left:</span>
                        <span className="font-medium">
                          {coupon.usage_limit - coupon.used_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="space-y-3">
                    {hasUsed && (
                      <div className="flex items-center justify-center p-2 bg-green-100 text-green-800 rounded-lg">
                        <Check className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Already Used</span>
                      </div>
                    )}
                    
                    {expired && !hasUsed && (
                      <div className="flex items-center justify-center p-2 bg-red-100 text-red-800 rounded-lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Expired</span>
                      </div>
                    )}
                    
                    {limitReached && !hasUsed && !expired && (
                      <div className="flex items-center justify-center p-2 bg-yellow-100 text-yellow-800 rounded-lg">
                        <span className="text-sm font-medium">Usage Limit Reached</span>
                      </div>
                    )}
                    
                    {canUse && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Copy}
                          onClick={() => copyCouponCode(coupon.code)}
                          className="flex-1"
                        >
                          Copy Code
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => applyCoupon(coupon.code)}
                          className="flex-1"
                        >
                          Apply Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Applied Indicator */}
                {appliedCoupon === coupon.code && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* How to Use Coupons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          How to Use Coupons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              1
            </div>
            <h4 className="font-semibold mb-2">Copy Code</h4>
            <p className="text-sm text-gray-600">Click the copy button to copy the coupon code</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              2
            </div>
            <h4 className="font-semibold mb-2">Shop</h4>
            <p className="text-sm text-gray-600">Add products to your cart and proceed to checkout</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              3
            </div>
            <h4 className="font-semibold mb-2">Apply</h4>
            <p className="text-sm text-gray-600">Paste the coupon code in the discount field</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              4
            </div>
            <h4 className="font-semibold mb-2">Save</h4>
            <p className="text-sm text-gray-600">Enjoy your discount and complete your order</p>
          </div>
        </div>
      </motion.div>

      {/* Terms & Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-gray-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>• One coupon per order:</strong> Only one coupon can be used per transaction
          </div>
          <div>
            <strong>• Minimum order value:</strong> Each coupon has a minimum order requirement
          </div>
          <div>
            <strong>• Expiry dates:</strong> Coupons must be used before their expiry date
          </div>
          <div>
            <strong>• Non-transferable:</strong> Coupons cannot be transferred or sold
          </div>
          <div>
            <strong>• Limited usage:</strong> Some coupons have usage limits per customer
          </div>
          <div>
            <strong>• No cash value:</strong> Coupons have no cash value and cannot be refunded
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CouponManager;