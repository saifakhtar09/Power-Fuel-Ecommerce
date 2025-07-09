import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Calendar,
  Eye,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  productGrowth: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch current period stats
      const [ordersResult, customersResult, productsResult, recentOrdersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount, created_at')
          .gte('created_at', startDate.toISOString())
          .eq('payment_status', 'paid'),
        
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString()),
        
        supabase
          .from('products')
          .select('id')
          .eq('is_active', true),
        
        supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_amount,
            status,
            created_at,
            profiles (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Calculate stats
      const orders = ordersResult.data || [];
      const customers = customersResult.data || [];
      const products = productsResult.data || [];
      const recentOrdersData = recentOrdersResult.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const totalOrders = orders.length;
      const totalCustomers = customers.length;
      const totalProducts = products.length;

      // Calculate growth (simplified - comparing with previous period)
      const previousStartDate = new Date(startDate);
      previousStartDate.setTime(previousStartDate.getTime() - (endDate.getTime() - startDate.getTime()));

      const [prevOrdersResult, prevCustomersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
          .eq('payment_status', 'paid'),
        
        supabase
          .from('profiles')
          .select('id')
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
      ]);

      const prevOrders = prevOrdersResult.data || [];
      const prevCustomers = prevCustomersResult.data || [];
      
      const prevRevenue = prevOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const prevOrderCount = prevOrders.length;
      const prevCustomerCount = prevCustomers.length;

      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderGrowth = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;
      const customerGrowth = prevCustomerCount > 0 ? ((totalCustomers - prevCustomerCount) / prevCustomerCount) * 100 : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        orderGrowth,
        customerGrowth,
        productGrowth: 0 // Simplified for now
      });

      setRecentOrders(recentOrdersData.map(order => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.profiles?.full_name || 'Guest',
        total_amount: parseFloat(order.total_amount),
        status: order.status,
        created_at: order.created_at
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      growth: stats.orderGrowth,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      growth: stats.customerGrowth,
      icon: Users,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      growth: stats.productGrowth,
      icon: Package,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" icon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${card.growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${card.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {card.growth >= 0 ? '+' : ''}{card.growth.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be implemented with a charting library</p>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm" icon={Eye}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">#{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <Package className="w-6 h-6 mb-2" />
            Add Product
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <ShoppingCart className="w-6 h-6 mb-2" />
            View Orders
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Users className="w-6 h-6 mb-2" />
            Manage Customers
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <BarChart3 className="w-6 h-6 mb-2" />
            Analytics
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;