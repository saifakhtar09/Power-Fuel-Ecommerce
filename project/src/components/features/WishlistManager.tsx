import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Share2, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  compare_price?: number;
  brand: string;
  category: string;
  is_available: boolean;
  created_at: string;
}

const WishlistManager: React.FC = () => {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          created_at,
          products (
            name,
            price,
            compare_price,
            images,
            is_active,
            brands (name),
            categories (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name || '',
        product_image: item.products?.images?.[0] || '/placeholder-product.jpg',
        price: item.products?.price || 0,
        compare_price: item.products?.compare_price,
        brand: item.products?.brands?.name || '',
        category: item.products?.categories?.name || '',
        is_available: item.products?.is_active || false,
        created_at: item.created_at
      })) || [];

      setWishlistItems(formattedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;

      setWishlistItems(items => items.filter(item => item.id !== wishlistId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const addToCart = (item: WishlistItem) => {
    addItem({
      productId: item.product_id,
      name: item.product_name,
      price: item.price,
      image: item.product_image,
      flavor: 'Default', // You might want to let user select this
      size: 'Default', // You might want to let user select this
      quantity: 1
    });

    toast.success(`Added ${item.product_name} to cart!`);
  };

  const shareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist/${user?.id}`;
    navigator.clipboard.writeText(wishlistUrl);
    toast.success('Wishlist link copied to clipboard!');
  };

  const moveAllToCart = () => {
    const availableItems = wishlistItems.filter(item => item.is_available);
    
    availableItems.forEach(item => {
      addToCart(item);
    });

    toast.success(`Added ${availableItems.length} items to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex space-x-4">
            <Button variant="outline" icon={Share2} onClick={shareWishlist}>
              Share Wishlist
            </Button>
            <Button 
              variant="primary" 
              icon={ShoppingCart} 
              onClick={moveAllToCart}
              disabled={wishlistItems.filter(item => item.is_available).length === 0}
            >
              Add All to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding products you love to your wishlist. You can save items for later and 
            easily add them to your cart when you're ready to purchase.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '#products'}>
            Start Shopping
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <motion.button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>

                  {/* Discount Badge */}
                  {item.compare_price && item.compare_price > item.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {Math.round(((item.compare_price - item.price) / item.compare_price) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.brand} • {item.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product_name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.price.toFixed(2)}
                    </span>
                    {item.compare_price && item.compare_price > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.compare_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShoppingCart}
                      className="flex-1"
                      onClick={() => addToCart(item)}
                      disabled={!item.is_available}
                    >
                      {item.is_available ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => window.location.href = `/product/${item.product_id}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Wishlist Stats */}
      {wishlistItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{wishlistItems.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {wishlistItems.filter(item => item.is_available).length}
              </p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {wishlistItems.filter(item => !item.is_available).length}
              </p>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ₹{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Wishlist Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Share with Friends:</strong> Use the share button to send your wishlist to friends and family
          </div>
          <div>
            <strong>Price Alerts:</strong> We'll notify you when items in your wishlist go on sale
          </div>
          <div>
            <strong>Quick Add:</strong> Use "Add All to Cart" to quickly purchase multiple items
          </div>
          <div>
            <strong>Save for Later:</strong> Items stay in your wishlist until you remove them
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WishlistManager;