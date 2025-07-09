import React from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, MessageSquare, DollarSign } from 'lucide-react';
import { CartItem, Address } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  codCharges: number;
  total: number;
  shippingAddress: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  paymentMethod: string;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  taxAmount,
  shippingAmount,
  codCharges,
  total,
  shippingAddress,
  paymentMethod,
  notes,
  onNotesChange
}) => {
  const getPaymentMethodDisplay = (method: string) => {
    const methods = {
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'upi': 'UPI Payment',
      'net_banking': 'Net Banking',
      'cod': 'Cash on Delivery'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return '💳';
      case 'upi':
        return '📱';
      case 'net_banking':
        return '🏦';
      case 'cod':
        return '💵';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          <Package className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Order Items ({items.length})</h3>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.flavor} • {item.size}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        </div>

        <div className="text-gray-700">
          <p className="font-medium">{shippingAddress.full_name}</p>
          {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
          <p>{shippingAddress.address_line_1}</p>
          {shippingAddress.address_line_2 && <p>{shippingAddress.address_line_2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
          <p>{shippingAddress.country}</p>
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          <CreditCard className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getPaymentMethodIcon(paymentMethod)}</span>
          <div>
            <p className="font-medium text-gray-900">{getPaymentMethodDisplay(paymentMethod)}</p>
            {paymentMethod === 'cod' && (
              <p className="text-sm text-orange-600">₹50 COD charges will be added</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Order Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          <MessageSquare className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Order Notes (Optional)</h3>
        </div>

        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any special instructions for your order..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
      </motion.div>

      {/* Order Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-2 border-primary-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Order Total
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (GST 18%)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount.toFixed(2)}`}</span>
          </div>
          {codCharges > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>COD Charges</span>
              <span>₹{codCharges.toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {shippingAmount === 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🎉 You qualify for FREE shipping!
            </p>
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 font-medium">
              💵 Cash on Delivery - Pay ₹{total.toFixed(2)} when your order arrives
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderSummary;