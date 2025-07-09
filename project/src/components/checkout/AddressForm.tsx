import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Copy } from 'lucide-react';
import { Address } from '../../types';

interface AddressFormProps {
  shippingAddress: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  billingAddress: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  onShippingChange: (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onBillingChange: (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  shippingAddress,
  billingAddress,
  onShippingChange,
  onBillingChange
}) => {
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleShippingChange = (field: string, value: string) => {
    const updatedAddress = { ...shippingAddress, [field]: value };
    onShippingChange(updatedAddress);
    
    if (sameAsShipping) {
      onBillingChange({ ...updatedAddress, type: 'billing' });
    }
  };

  const handleBillingChange = (field: string, value: string) => {
    onBillingChange({ ...billingAddress, [field]: value });
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      onBillingChange({ ...shippingAddress, type: 'billing' });
    }
  };

  // Indian states - Fixed array
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh', 
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh'
  ];

  // Major cities by state
  const citiesByState: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda']
  };

  const getAvailableCities = (state: string) => {
    return citiesByState[state] || [];
  };

  return (
    <div className="space-y-8">
      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={shippingAddress.full_name || ''}
              onChange={(e) => handleShippingChange('full_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={shippingAddress.phone || ''}
              onChange={(e) => handleShippingChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={shippingAddress.address_line_1 || ''}
              onChange={(e) => handleShippingChange('address_line_1', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="House/Flat number, Building name, Street"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={shippingAddress.address_line_2 || ''}
              onChange={(e) => handleShippingChange('address_line_2', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Area, Locality, Landmark (Optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              value={shippingAddress.state || ''}
              onChange={(e) => {
                handleShippingChange('state', e.target.value);
                handleShippingChange('city', ''); // Clear city when state changes
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              required
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            {shippingAddress.state && getAvailableCities(shippingAddress.state).length > 0 ? (
              <select
                value={shippingAddress.city || ''}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select City</option>
                {getAvailableCities(shippingAddress.state).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="other">Other (Type below)</option>
              </select>
            ) : (
              <input
                type="text"
                value={shippingAddress.city || ''}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                placeholder="Enter your city"
                required
              />
            )}
            
            {/* Custom city input when "Other" is selected */}
            {shippingAddress.city === 'other' && (
              <input
                type="text"
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white mt-2"
                placeholder="Enter your city name"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              value={shippingAddress.postal_code || ''}
              onChange={(e) => handleShippingChange('postal_code', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="400001"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={shippingAddress.country || 'IN'}
              onChange={(e) => handleShippingChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              required
            >
              <option value="IN">India</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Billing Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
          </div>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => handleSameAsShippingChange(e.target.checked)}
              className="mr-2 rounded"
            />
            <span className="text-sm text-gray-600">Same as shipping</span>
          </label>
        </div>

        {!sameAsShipping && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={billingAddress.full_name || ''}
                onChange={(e) => handleBillingChange('full_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={billingAddress.phone || ''}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={billingAddress.address_line_1 || ''}
                onChange={(e) => handleBillingChange('address_line_1', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                placeholder="House/Flat number, Building name, Street"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={billingAddress.address_line_2 || ''}
                onChange={(e) => handleBillingChange('address_line_2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                placeholder="Area, Locality, Landmark (Optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={billingAddress.state || ''}
                onChange={(e) => {
                  handleBillingChange('state', e.target.value);
                  handleBillingChange('city', '');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              {billingAddress.state && getAvailableCities(billingAddress.state).length > 0 ? (
                <select
                  value={billingAddress.city || ''}
                  onChange={(e) => handleBillingChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select City</option>
                  {getAvailableCities(billingAddress.state).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                  <option value="other">Other (Type below)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={billingAddress.city || ''}
                  onChange={(e) => handleBillingChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  placeholder="Enter your city"
                  required
                />
              )}
              
              {billingAddress.city === 'other' && (
                <input
                  type="text"
                  onChange={(e) => handleBillingChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white mt-2"
                  placeholder="Enter your city name"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code *
              </label>
              <input
                type="text"
                value={billingAddress.postal_code || ''}
                onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                placeholder="400001"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={billingAddress.country || 'IN'}
                onChange={(e) => handleBillingChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
              >
                <option value="IN">India</option>
              </select>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddressForm;