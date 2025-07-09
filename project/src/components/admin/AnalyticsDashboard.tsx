import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  avgOrderValue: {
    current: number;
    previous: number;
    growth: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date ranges
      const endDate = new Date();
      const startDate = new Date();
      const prevStartDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          prevStartDate.setDate(endDate.getDate() - 14);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          prevStartDate.setDate(endDate.getDate() - 60);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          prevStartDate.setDate(endDate.getDate() - 180);
          break;
      }

      // Fetch current period data
      const [ordersResult, customersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount, created_at, order_items(*)')
          .gte('created_at', startDate.toISOString())
          .eq('payment_status', 'paid'),
        
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
      ]);

      // Fetch previous period data for comparison
      const [prevOrdersResult, prevCustomersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
          .eq('payment_status', 'paid'),
        
        supabase
          .from('profiles')
          .select('id')
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
      ]);

      const orders = ordersResult.data || [];
      const customers = customersResult.data || [];
      const prevOrders = prevOrdersResult.data || [];
      const prevCustomers = prevCustomersResult.data || [];

      // Calculate metrics
      const currentRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const previousRevenue = prevOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const currentOrders = orders.length;
      const previousOrders = prevOrders.length;
      const ordersGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

      const currentCustomers = customers.length;
      const previousCustomers = prevCustomers.length;
      const customersGrowth = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;

      const currentAOV = currentOrders > 0 ? currentRevenue / currentOrders : 0;
      const previousAOV = previousOrders > 0 ? previousRevenue / previousOrders : 0;
      const aovGrowth = previousAOV > 0 ? ((currentAOV - previousAOV) / previousAOV) * 100 : 0;

      // Mock data for charts (in a real app, this would come from proper aggregation)
      const topProducts = [
        { name: 'PowerMax Whey Isolate', sales: 150, revenue: 8999 },
        { name: 'Plant Power Vegan Blend', sales: 120, revenue: 5999 },
        { name: 'Elite Casein Night Formula', sales: 90, revenue: 4949 },
        { name: 'Mass Gainer Extreme', sales: 75, revenue: 5249 },
        { name: 'Pure Creatine Monohydrate', sales: 200, revenue: 5999 }
      ];

      const salesByCategory = [
        { category: 'Protein Powders', sales: 450, percentage: 45 },
        { category: 'Mass Gainers', sales: 200, percentage: 20 },
        { category: 'Pre-Workout', sales: 150, percentage: 15 },
        { category: 'Vitamins', sales: 120, percentage: 12 },
        { category: 'Accessories', sales: 80, percentage: 8 }
      ];

      const recentActivity = [
        { type: 'order', description: 'New order #PF20241228-1234', timestamp: '2 minutes ago' },
        { type: 'customer', description: 'New customer registration', timestamp: '5 minutes ago' },
        { type: 'product', description: 'Low stock alert: PowerMax Whey', timestamp: '10 minutes ago' },
        { type: 'review', description: 'New 5-star review received', timestamp: '15 minutes ago' },
        { type: 'return', description: 'Return request processed', timestamp: '20 minutes ago' }
      ];

      setAnalytics({
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          growth: revenueGrowth
        },
        orders: {
          current: currentOrders,
          previous: previousOrders,
          growth: ordersGrowth
        },
        customers: {
          current: currentCustomers,
          previous: previousCustomers,
          growth: customersGrowth
        },
        avgOrderValue: {
          current: currentAOV,
          previous: previousAOV,
          growth: aovGrowth
        },
        topProducts,
        salesByCategory,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const MetricCard = ({ title, current, growth, icon: Icon, format = 'number' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {format === 'currency' ? `₹${current.toLocaleString()}` : current.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
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
          </select>
          
          <Button variant="outline" icon={Filter}>
            Filters
          </Button>
          
          <Button variant="primary" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          current={analytics.revenue.current}
          growth={analytics.revenue.growth}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Total Orders"
          current={analytics.orders.current}
          growth={analytics.orders.growth}
          icon={ShoppingCart}
        />
        <MetricCard
          title="New Customers"
          current={analytics.customers.current}
          growth={analytics.customers.growth}
          icon={Users}
        />
        <MetricCard
          title="Avg Order Value"
          current={analytics.avgOrderValue.current}
          growth={analytics.avgOrderValue.growth}
          icon={Package}
          format="currency"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {analytics.salesByCategory.map((category) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm text-gray-500">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;