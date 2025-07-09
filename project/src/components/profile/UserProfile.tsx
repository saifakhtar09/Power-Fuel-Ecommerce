import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, MapPin, CreditCard, Heart, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import Button from '../ui/Button';
import OrderHistory from './OrderHistory';
import AddressBook from './AddressBook';
import ProfileSettings from './ProfileSettings';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useAuthStore();
  const { orders, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    if (user && isOpen) {
      fetchUserOrders(user.id);
    }
  }, [user, isOpen, fetchUserOrders]);

  const tabs = [
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderHistory orders={orders} />;
      case 'addresses':
        return <AddressBook />;
      case 'payment':
        return <div className="p-6 text-center text-gray-500">Payment methods coming soon...</div>;
      case 'wishlist':
        return <div className="p-6 text-center text-gray-500">Wishlist coming soon...</div>;
      case 'settings':
        return <ProfileSettings />;
      default:
        return null;
    }
  };

  if (!user) return null;

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex h-[calc(90vh-120px)]">
                {/* Sidebar */}
                <div className="w-64 border-r bg-gray-50 p-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <tab.icon size={20} />
                        <span>{tab.label}</span>
                      </motion.button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;