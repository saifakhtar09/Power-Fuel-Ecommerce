import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { Order } from '../../types';
import Button from '../ui/Button';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="font-medium text-gray-900">
                    Order #{order.order_number}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-4">
                  {order.order_items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{order.order_items.length - 3} more items
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tracking Number:</strong> {order.tracking_number}
                </p>
                {order.estimated_delivery_date && (
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Delivery:</strong> {new Date(order.estimated_delivery_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {order.order_items?.length || 0} item(s) • {order.payment_method.replace('_', ' ')}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={Eye}>
                  View Details
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="primary" size="sm">
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;