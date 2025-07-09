import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Copy, Share2, BarChart3, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AffiliateData {
  affiliate_code: string;
  commission_rate: number;
  status: string;
  total_earnings: number;
  total_clicks: number;
  total_conversions: number;
  pending_earnings: number;
  paid_earnings: number;
  commissions: Array<{
    id: string;
    order_id: string;
    commission_amount: number;
    status: string;
    created_at: string;
  }>;
}

const AffiliateProgram: React.FC = () => {
  const { user } = useAuthStore();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    if (user) {
      checkAffiliateStatus();
    }
  }, [user]);

  const checkAffiliateStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select(`
          *,
          affiliate_commissions (*)
        `)
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setIsAffiliate(true);
        const commissions = data.affiliate_commissions || [];
        const pendingEarnings = commissions
          .filter((c: any) => c.status === 'pending' || c.status === 'approved')
          .reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0);
        
        const paidEarnings = commissions
          .filter((c: any) => c.status === 'paid')
          .reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0);

        setAffiliateData({
          affiliate_code: data.affiliate_code,
          commission_rate: data.commission_rate,
          status: data.status,
          total_earnings: data.total_earnings,
          total_clicks: data.total_clicks,
          total_conversions: data.total_conversions,
          pending_earnings: pendingEarnings,
          paid_earnings: paidEarnings,
          commissions: commissions.slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error checking affiliate status:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyForAffiliate = async () => {
    if (!user) return;

    try {
      const affiliateCode = `AF${user.id.slice(0, 8).toUpperCase()}`;
      
      const { error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          affiliate_code: affiliateCode,
          commission_rate: 5.0,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Affiliate application submitted! We\'ll review it within 24 hours.');
      checkAffiliateStatus();
    } catch (error) {
      console.error('Error applying for affiliate:', error);
      toast.error('Failed to submit affiliate application');
    }
  };

  const copyAffiliateLink = () => {
    if (!affiliateData) return;
    
    const affiliateLink = `${window.location.origin}?ref=${affiliateData.affiliate_code}`;
    navigator.clipboard.writeText(affiliateLink);
    toast.success('Affiliate link copied to clipboard!');
  };

  const shareOnSocial = (platform: string) => {
    if (!affiliateData) return;
    
    const affiliateLink = `${window.location.origin}?ref=${affiliateData.affiliate_code}`;
    const message = "Check out these amazing protein supplements! Use my link for the best deals.";
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(affiliateLink)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + affiliateLink)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAffiliate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-white mb-8">
            <DollarSign className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Join Our Affiliate Program</h1>
            <p className="text-xl opacity-90 mb-8">
              Earn commission by promoting our premium protein supplements
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={applyForAffiliate}
              className="bg-white text-primary-500 hover:bg-gray-100"
            >
              Apply Now
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">5% Commission</h3>
              <p className="text-gray-600">Earn 5% commission on every sale you refer</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Limits</h3>
              <p className="text-gray-600">Unlimited earning potential with no caps</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your performance with detailed analytics</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
                <h4 className="font-semibold mb-2">Apply</h4>
                <p className="text-sm text-gray-600">Submit your affiliate application</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
                <h4 className="font-semibold mb-2">Get Approved</h4>
                <p className="text-sm text-gray-600">We'll review and approve your application</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
                <h4 className="font-semibold mb-2">Promote</h4>
                <p className="text-sm text-gray-600">Share your unique affiliate link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
                <h4 className="font-semibold mb-2">Earn</h4>
                <p className="text-sm text-gray-600">Get paid for every successful referral</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Dashboard</h1>
        <p className="text-gray-600">Track your performance and earnings</p>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-6 text-white ${
          affiliateData?.status === 'active' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : affiliateData?.status === 'pending'
            ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
            : 'bg-gradient-to-r from-red-500 to-pink-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Status: {affiliateData?.status?.charAt(0).toUpperCase() + affiliateData?.status?.slice(1)}
            </h2>
            <p className="opacity-90">Affiliate Code: {affiliateData?.affiliate_code}</p>
            <p className="opacity-90">Commission Rate: {affiliateData?.commission_rate}%</p>
          </div>
          {affiliateData?.status === 'active' && (
            <div className="text-right">
              <p className="text-sm opacity-90">Total Earnings</p>
              <p className="text-3xl font-bold">₹{affiliateData?.total_earnings.toFixed(2)}</p>
            </div>
          )}
        </div>
      </motion.div>

      {affiliateData?.status === 'active' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{affiliateData.total_clicks}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900">{affiliateData.total_conversions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                  <p className="text-3xl font-bold text-yellow-600">₹{affiliateData.pending_earnings.toFixed(2)}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {affiliateData.total_clicks > 0 
                      ? ((affiliateData.total_conversions / affiliateData.total_clicks) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
          </div>

          {/* Affiliate Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Affiliate Link</h3>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={`${window.location.origin}?ref=${affiliateData.affiliate_code}`}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button variant="outline" icon={Copy} onClick={copyAffiliateLink}>
                Copy
              </Button>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => shareOnSocial('facebook')}
                className="flex-1"
              >
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => shareOnSocial('twitter')}
                className="flex-1"
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareOnSocial('whatsapp')}
                className="flex-1"
              >
                Share on WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* Recent Commissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Commissions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliateData.commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">#{commission.order_id.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        ₹{commission.commission_amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          commission.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : commission.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commission.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AffiliateProgram;