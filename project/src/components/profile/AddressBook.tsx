import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Address } from '../../types';
import Button from '../ui/Button';

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  if (addresses.length === 0 && !isAddingAddress) {
    return (
      <div className="p-6 text-center">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Addresses Saved</h3>
        <p className="text-gray-600 mb-6">Add an address to make checkout faster!</p>
        <Button variant="primary" icon={Plus} onClick={handleAddAddress}>
          Add Address
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Address Book</h3>
        <Button variant="primary" icon={Plus} onClick={handleAddAddress}>
          Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="font-medium text-gray-900">
                  {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                </span>
                {address.is_default && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{address.full_name}</p>
              {address.phone && <p>{address.phone}</p>}
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;