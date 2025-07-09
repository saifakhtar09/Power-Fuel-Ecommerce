import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, MapPin, Package, CheckCircle, Loader } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import Button from '../ui/Button';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import toast from 'react-hot-toast';
import { Address, CheckoutData } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { items, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const { processPayment } = useOrderStore();

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    items,
    shipping_address: {
      type: 'shipping',
      is_default: false,
      full_name: user?.name || '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'IN'
    },
    billing_address: {
      type: 'billing',
      is_default: false,
      full_name: user?.name || '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'IN'
    },
    payment_method: 'cod',
    coupon_code: '',
    notes: ''
  });

  const steps = [
    { id: 1, title: 'Shipping', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: Package },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  const subtotal = getTotal();
  const taxRate = 0.18; // 18% GST for India
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
  const codCharges = checkoutData.payment_method === 'cod' ? 50 : 0;
  const total = subtotal + taxAmount + shippingAmount + codCharges;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCheckoutData(prev => ({
        ...prev,
        items,
        shipping_address: {
          ...prev.shipping_address,
          full_name: user?.name || '',
        },
        billing_address: {
          ...prev.billing_address,
          full_name: user?.name || '',
        }
      }));
    }
  }, [isOpen, user, items]);

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate shipping address
      const { shipping_address } = checkoutData;
      
      if (!shipping_address.full_name?.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      if (!shipping_address.phone?.trim()) {
        toast.error('Please enter your phone number');
        return;
      }
      if (!shipping_address.address_line_1?.trim()) {
        toast.error('Please enter your address');
        return;
      }
      if (!shipping_address.city?.trim() || shipping_address.city === 'other') {
        toast.error('Please select or enter your city');
        return;
      }
      if (!shipping_address.state?.trim()) {
        toast.error('Please select your state');
        return;
      }
      if (!shipping_address.postal_code?.trim()) {
        toast.error('Please enter your postal code');
        return;
      }
      if (!/^\d{6}$/.test(shipping_address.postal_code)) {
        toast.error('Please enter a valid 6-digit PIN code');
        return;
      }
    }
    
    if (currentStep === 2) {
      // Validate payment method
      if (!checkoutData.payment_method) {
        toast.error('Please select a payment method');
        return;
      }
      
      // For COD, validate minimum order amount
      if (checkoutData.payment_method === 'cod' && subtotal < 500) {
        toast.error('Minimum order amount for COD is ₹500');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        payment_method: checkoutData.payment_method,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total_amount: total,
        shipping_address: checkoutData.shipping_address,
        billing_address: checkoutData.billing_address,
        notes: checkoutData.notes,
        items: checkoutData.items
      };

      const result = await processPayment(orderData);
      
      if (result.success) {
        clearCart();
        setCurrentStep(4);
        
        // Show success message based on payment method
        if (checkoutData.payment_method === 'cod') {
          toast.success('Order placed successfully! You will receive a confirmation call within 24 hours.');
        } else {
          toast.success('Order placed and payment confirmed!');
        }
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const updateCheckoutData = (field: keyof CheckoutData, value: any) => {
    setCheckoutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingAddressChange = (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    updateCheckoutData('shipping_address', address);
  };

  const handleBillingAddressChange = (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    updateCheckoutData('billing_address', address);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            shippingAddress={checkoutData.shipping_address}
            billingAddress={checkoutData.billing_address}
            onShippingChange={handleShippingAddressChange}
            onBillingChange={handleBillingAddressChange}
          />
        );
      case 2:
        return (
          <PaymentForm
            paymentMethod={checkoutData.payment_method}
            onPaymentMethodChange={(method) => updateCheckoutData('payment_method', method)}
          />
        );
      case 3:
        return (
          <OrderSummary
            items={items}
            subtotal={subtotal}
            taxAmount={taxAmount}
            shippingAmount={shippingAmount}
            codCharges={codCharges}
            total={total}
            shippingAddress={checkoutData.shipping_address}
            paymentMethod={checkoutData.payment_method}
            notes={checkoutData.notes || ''}
            onNotesChange={(notes) => updateCheckoutData('notes', notes)}
          />
        );
      case 4:
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h3>
            
            {checkoutData.payment_method === 'cod' ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">
                  Thank you for your order! Our team will call you within 24 hours to confirm your order details.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-orange-900 mb-2">Cash on Delivery Instructions:</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Keep ₹{total.toFixed(2)} ready (including ₹50 COD charges)</li>
                    <li>• Please keep exact change if possible</li>
                    <li>• Our delivery partner will call before delivery</li>
                    <li>• Delivery within 3-7 business days</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Thank you for your order. You'll receive a confirmation email shortly with tracking details.
              </p>
            )}
            
            <div className="space-y-3">
              <Button variant="primary" onClick={onClose}>
                Continue Shopping
              </Button>
              <p className="text-sm text-gray-500">
                Track your order in the "My Account" section
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Steps */}
              {currentStep < 4 && (
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    {steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          currentStep >= step.id 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <step.icon size={20} />
                        </div>
                        <span className={`ml-2 font-medium ${
                          currentStep >= step.id ? 'text-primary-500' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                        {index < 2 && (
                          <div className={`w-16 h-1 mx-4 ${
                            currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {renderStepContent()}
              </div>

              {/* Footer */}
              {currentStep < 4 && (
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                  <div className="text-lg font-bold">
                    Total: ₹{total.toFixed(2)}
                    {codCharges > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (includes ₹{codCharges} COD charges)
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={handleBack} disabled={loading}>
                        Back
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button variant="primary" onClick={handleNext} disabled={loading}>
                        Continue
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        onClick={handlePlaceOrder}
                        loading={loading}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Place Order'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;