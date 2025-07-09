import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Trophy, Zap, Crown, Award } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface LoyaltyData {
  points: number;
  tier: string;
  nextTier: string;
  pointsToNextTier: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: Array<{
    id: string;
    type: string;
    points: number;
    description: string;
    created_at: string;
  }>;
}

const LoyaltyProgram: React.FC = () => {
  const { user } = useAuthStore();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
    }
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      const [profileResult, transactionsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('loyalty_points')
          .eq('id', user?.id)
          .single(),
        
        supabase
          .from('loyalty_transactions')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const points = profileResult.data?.loyalty_points || 0;
      const transactions = transactionsResult.data || [];

      const totalEarned = transactions
        .filter(t => t.type === 'earned')
        .reduce((sum, t) => sum + t.points, 0);
      
      const totalRedeemed = transactions
        .filter(t => t.type === 'redeemed')
        .reduce((sum, t) => sum + Math.abs(t.points), 0);

      // Determine tier based on points
      let tier = 'Bronze';
      let nextTier = 'Silver';
      let pointsToNextTier = 1000 - points;

      if (points >= 5000) {
        tier = 'Platinum';
        nextTier = 'Diamond';
        pointsToNextTier = 10000 - points;
      } else if (points >= 2500) {
        tier = 'Gold';
        nextTier = 'Platinum';
        pointsToNextTier = 5000 - points;
      } else if (points >= 1000) {
        tier = 'Silver';
        nextTier = 'Gold';
        pointsToNextTier = 2500 - points;
      }

      if (points >= 10000) {
        tier = 'Diamond';
        nextTier = 'Diamond';
        pointsToNextTier = 0;
      }

      setLoyaltyData({
        points,
        tier,
        nextTier,
        pointsToNextTier: Math.max(0, pointsToNextTier),
        totalEarned,
        totalRedeemed,
        transactions
      });
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async (pointsToRedeem: number, reward: string) => {
    if (!user || !loyaltyData) return;

    if (loyaltyData.points < pointsToRedeem) {
      toast.error('Insufficient points');
      return;
    }

    try {
      // Create redemption transaction
      await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: user.id,
          type: 'redeemed',
          points: -pointsToRedeem,
          description: `Redeemed: ${reward}`
        });

      // Update user points
      await supabase
        .from('profiles')
        .update({ loyalty_points: loyaltyData.points - pointsToRedeem })
        .eq('id', user.id);

      toast.success(`Successfully redeemed ${pointsToRedeem} points for ${reward}!`);
      fetchLoyaltyData();
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error('Failed to redeem points');
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="w-6 h-6 text-orange-600" />;
      case 'Silver': return <Star className="w-6 h-6 text-gray-500" />;
      case 'Gold': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'Platinum': return <Zap className="w-6 h-6 text-purple-500" />;
      case 'Diamond': return <Crown className="w-6 h-6 text-blue-500" />;
      default: return <Gift className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'from-orange-400 to-orange-600';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-purple-400 to-purple-600';
      case 'Diamond': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const rewards = [
    { points: 500, reward: '₹50 Discount Coupon', description: 'Get ₹50 off your next order' },
    { points: 1000, reward: '₹100 Discount Coupon', description: 'Get ₹100 off your next order' },
    { points: 2000, reward: 'Free Shipping for 3 months', description: 'Enjoy free shipping on all orders' },
    { points: 3000, reward: '₹300 Discount Coupon', description: 'Get ₹300 off your next order' },
    { points: 5000, reward: 'VIP Membership Upgrade', description: 'Upgrade to VIP status with exclusive benefits' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!loyaltyData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
        <p className="text-gray-600">Earn points with every purchase and unlock exclusive rewards!</p>
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getTierColor(loyaltyData.tier)} rounded-2xl p-8 text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {getTierIcon(loyaltyData.tier)}
              <h2 className="text-2xl font-bold">{loyaltyData.tier} Member</h2>
            </div>
            <p className="text-xl font-semibold mb-2">{loyaltyData.points.toLocaleString()} Points</p>
            {loyaltyData.pointsToNextTier > 0 && (
              <p className="opacity-90">
                {loyaltyData.pointsToNextTier} points to {loyaltyData.nextTier}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Total Earned</p>
            <p className="text-2xl font-bold">{loyaltyData.totalEarned.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {loyaltyData.pointsToNextTier > 0 && (
          <div className="mt-6">
            <div className="bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNextTier)) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <Gift className="w-8 h-8 text-primary-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Available Points</h3>
          <p className="text-3xl font-bold text-primary-500">{loyaltyData.points}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <Star className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Total Earned</h3>
          <p className="text-3xl font-bold text-green-500">{loyaltyData.totalEarned}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Total Redeemed</h3>
          <p className="text-3xl font-bold text-orange-500">{loyaltyData.totalRedeemed}</p>
        </motion.div>
      </div>

      {/* Available Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{reward.reward}</h4>
                <span className="text-primary-500 font-bold">{reward.points} pts</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
              <Button
                variant={loyaltyData.points >= reward.points ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                disabled={loyaltyData.points < reward.points}
                onClick={() => redeemPoints(reward.points, reward.reward)}
              >
                {loyaltyData.points >= reward.points ? 'Redeem' : 'Not Enough Points'}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {loyaltyData.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className={`font-bold ${transaction.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.points > 0 ? '+' : ''}{transaction.points} pts
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How to Earn Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <span className="text-gray-700">Earn 1 point for every ₹1 spent</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <span className="text-gray-700">Get 100 bonus points for reviews</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <span className="text-gray-700">Refer friends and earn 500 points</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">4</span>
            </div>
            <span className="text-gray-700">Birthday bonus: 1000 points</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoyaltyProgram;