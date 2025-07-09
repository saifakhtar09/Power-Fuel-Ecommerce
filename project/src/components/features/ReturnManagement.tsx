import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Upload, MessageSquare, CheckCircle, X, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface ReturnRequest {
  id: string;
  return_number: string;
  order_id: string;
  order_number: string;
  reason: string;
  description: string;
  status: string;
  refund_amount: number;
  images: string[];
  created_at: string;
  return_items: Array<{
    product_name: string;
    quantity: number;
    reason: string;
  }>;
}

const ReturnManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchReturns();
      fetchEligibleOrders();
    }
  }, [user]);

  const fetchReturns = async () => {
    try {
      const { data, error } = await supabase
        .from('return_requests')
        .select(`
          *,
          orders (order_number),
          return_items (
            quantity,
            reason,
            order_items (product_name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReturns = data?.map(returnReq => ({
        id: returnReq.id,
        return_number: returnReq.return_number,
        order_id: returnReq.order_id,
        order_number: returnReq.orders?.order_number || '',
        reason: returnReq.reason,
        description: returnReq.description,
        status: returnReq.status,
        refund_amount: returnReq.refund_amount || 0,
        images: returnReq.images || [],
        created_at: returnReq.created_at,
        return_items: returnReq.return_items?.map((item: any) => ({
          product_name: item.order_items?.product_name || '',
          quantity: item.quantity,
          reason: item.reason
        })) || []
      })) || [];

      setReturns(formattedReturns);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleOrders = async () => {
    try {
      // Fetch orders from last 30 days that are delivered
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'delivered')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching eligible orders:', error);
    }
  };

  const createReturnRequest = async () => {
    if (!selectedOrder || !returnReason || selectedItems.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create return request
      const { data: returnRequest, error: returnError } = await supabase
        .from('return_requests')
        .insert({
          order_id: selectedOrder.id,
          user_id: user?.id,
          reason: returnReason,
          description: returnDescription,
          status: 'requested'
        })
        .select()
        .single();

      if (returnError) throw returnError;

      // Create return items
      const returnItems = selectedItems.map(item => ({
        return_request_id: returnRequest.id,
        order_item_id: item.id,
        quantity: item.return_quantity,
        reason: item.return_reason
      }));

      const { error: itemsError } = await supabase
        .from('return_items')
        .insert(returnItems);

      if (itemsError) throw itemsError;

      toast.success('Return request submitted successfully!');
      setShowCreateModal(false);
      setSelectedOrder(null);
      setReturnReason('');
      setReturnDescription('');
      setSelectedItems([]);
      fetchReturns();
    } catch (error) {
      console.error('Error creating return request:', error);
      toast.error('Failed to submit return request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'processed':
        return 'bg-indigo-100 text-indigo-800';
      case 'refunded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <X className="w-5 h-5" />;
      case 'refunded':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <RefreshCw className="w-5 h-5" />;
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
          <p className="text-gray-600">Manage your return requests and track refunds</p>
        </div>
        <Button
          variant="primary"
          icon={RefreshCw}
          onClick={() => setShowCreateModal(true)}
          disabled={orders.length === 0}
        >
          Request Return
        </Button>
      </div>

      {/* Return Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Return Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>30-Day Window:</strong> Returns accepted within 30 days of delivery
          </div>
          <div>
            <strong>Original Condition:</strong> Items must be unopened and in original packaging
          </div>
          <div>
            <strong>Free Returns:</strong> We provide free return shipping labels
          </div>
        </div>
      </motion.div>

      {/* Returns List */}
      {returns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Return Requests</h3>
          <p className="text-gray-600 mb-6">You haven't made any return requests yet.</p>
          {orders.length > 0 && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Request Your First Return
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnReq, index) => (
            <motion.div
              key={returnReq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Return #{returnReq.return_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order #{returnReq.order_number}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(returnReq.status)}`}>
                    {getStatusIcon(returnReq.status)}
                    <span className="ml-2">{returnReq.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Return Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Reason:</strong> {returnReq.reason.replace('_', ' ')}</p>
                    <p><strong>Description:</strong> {returnReq.description || 'N/A'}</p>
                    <p><strong>Requested:</strong> {new Date(returnReq.created_at).toLocaleDateString()}</p>
                    {returnReq.refund_amount > 0 && (
                      <p><strong>Refund Amount:</strong> ₹{returnReq.refund_amount.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Items to Return</h4>
                  <div className="space-y-2">
                    {returnReq.return_items.map((item, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        {item.reason && (
                          <p className="text-gray-600">Reason: {item.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {returnReq.status === 'approved' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Return approved! Please package the items and use our prepaid return label.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Download Return Label
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Return Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Request Return</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Select Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Order
                </label>
                <select
                  value={selectedOrder?.id || ''}
                  onChange={(e) => {
                    const order = orders.find(o => o.id === e.target.value);
                    setSelectedOrder(order);
                    setSelectedItems([]);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose an order</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      #{order.order_number} - ₹{order.total_amount} ({new Date(order.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Items */}
              {selectedOrder && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Items to Return
                  </label>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item: any) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.some(si => si.id === item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, {
                                  ...item,
                                  return_quantity: item.quantity,
                                  return_reason: ''
                                }]);
                              } else {
                                setSelectedItems(selectedItems.filter(si => si.id !== item.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              {item.flavor} • {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        
                        {selectedItems.some(si => si.id === item.id) && (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Return Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={selectedItems.find(si => si.id === item.id)?.return_quantity || 1}
                                onChange={(e) => {
                                  const updatedItems = selectedItems.map(si =>
                                    si.id === item.id
                                      ? { ...si, return_quantity: parseInt(e.target.value) }
                                      : si
                                  );
                                  setSelectedItems(updatedItems);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Reason
                              </label>
                              <select
                                value={selectedItems.find(si => si.id === item.id)?.return_reason || ''}
                                onChange={(e) => {
                                  const updatedItems = selectedItems.map(si =>
                                    si.id === item.id
                                      ? { ...si, return_reason: e.target.value }
                                      : si
                                  );
                                  setSelectedItems(updatedItems);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="">Select reason</option>
                                <option value="defective">Defective</option>
                                <option value="wrong_item">Wrong Item</option>
                                <option value="not_as_described">Not as Described</option>
                                <option value="changed_mind">Changed Mind</option>
                                <option value="damaged">Damaged</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Return Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Return Reason
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a reason</option>
                  <option value="defective">Product is defective</option>
                  <option value="wrong_item">Received wrong item</option>
                  <option value="not_as_described">Item not as described</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="damaged">Item arrived damaged</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide any additional details about your return request..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={createReturnRequest}
                  className="flex-1"
                  disabled={!selectedOrder || !returnReason || selectedItems.length === 0}
                >
                  Submit Return Request
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReturnManagement;