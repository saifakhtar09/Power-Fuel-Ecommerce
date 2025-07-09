import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import CheckoutModal from '../checkout/CheckoutModal';
import AuthModal from '../auth/AuthModal';
import toast from 'react-hot-toast';

const ShoppingCart: React.FC = () => {
  const { items, isOpen, setOpen, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);
  const total = getTotal();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!user) {
      setShowAuth(true);
      return;
    }
    
    setShowCheckout(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            
            {/* Cart Drawer */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shopping Cart ({items.length})
                </h2>
                <motion.button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50, height: 0 }}
                          transition={{ delay: index * 0.1 }}
                          layout
                        >
                          {/* Product Image */}
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          />
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.flavor} • {item.size}</p>
                            <p className="text-sm font-medium text-primary-600">${item.price}</p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Minus size={16} />
                            </motion.button>
                            
                            <motion.span
                              className="w-8 text-center font-medium"
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                            >
                              {item.quantity}
                            </motion.span>
                            
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>
                          
                          {/* Remove Button */}
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  className="border-t p-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.1, color: '#10b981' }}
                      animate={{ scale: 1, color: '#111827' }}
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    icon={CreditCard}
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  </Button>
                  
                  {/* Continue Shopping */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="signin"
      />
    </>
  );
};

export default ShoppingCart;