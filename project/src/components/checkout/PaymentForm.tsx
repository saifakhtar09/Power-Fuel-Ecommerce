import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Shield, Banknote, Wallet, Clock, Truck } from 'lucide-react';

interface PaymentFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when your order is delivered',
      popular: true
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      icon: CreditCard,
      description: 'All major debit cards accepted'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Pay using UPI apps like GPay, PhonePe'
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      icon: Wallet,
      description: 'All major banks supported'
    }
  ];

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPaymentMethodChange(method.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {method.popular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex items-center space-x-3">
                <method.icon className={`w-6 h-6 ${
                  paymentMethod === method.id ? 'text-primary-500' : 'text-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* COD Information */}
      {paymentMethod === 'cod' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <Truck className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-orange-900 mb-2">Cash on Delivery</h4>
              <div className="space-y-2 text-sm text-orange-800">
                <p>• Pay ₹50 extra as COD charges</p>
                <p>• Payment accepted in cash only</p>
                <p>• Please keep exact change ready</p>
                <p>• Available for orders above ₹500</p>
                <p>• Delivery within 3-7 business days</p>
              </div>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-sm font-medium text-orange-900">
                  💡 Tip: Orders are verified via phone call before dispatch
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Credit/Debit Card Form */}
      {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {paymentMethod === 'credit_card' ? 'Credit Card' : 'Debit Card'} Information
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => handleCardInputChange('number', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={cardData.cvc}
                  onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Your card information is encrypted and secure</span>
          </div>
        </motion.div>
      )}

      {/* UPI Payment */}
      {paymentMethod === 'upi' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">UPI Payment</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="yourname@paytm / yourname@gpay"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can also scan QR code on the next page
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold">G</span>
                </div>
                <span className="text-xs text-gray-600">Google Pay</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold">P</span>
                </div>
                <span className="text-xs text-gray-600">PhonePe</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <span className="text-xs text-gray-600">Paytm</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-orange-600 font-bold">B</span>
                </div>
                <span className="text-xs text-gray-600">BHIM</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Net Banking */}
      {paymentMethod === 'net_banking' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Net Banking</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Bank
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Choose your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="pnb">Punjab National Bank</option>
              <option value="bob">Bank of Baroda</option>
              <option value="canara">Canara Bank</option>
              <option value="union">Union Bank of India</option>
              <option value="other">Other Banks</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
        <Shield className="w-5 h-5 text-green-500" />
        <div>
          <p className="font-medium text-green-800">100% Secure Payments</p>
          <p className="text-green-700">Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;