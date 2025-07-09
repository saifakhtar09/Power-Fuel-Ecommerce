import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Heart, ShoppingCart, Zap, Award, Leaf } from 'lucide-react';
import { products } from '../../data/products';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ProductSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { addItem } = useCartStore();
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const categoryIcons: Record<string, any> = {
    'Whey Protein': Zap,
    'Plant Protein': Leaf,
    'Casein Protein': Award,
    'Mass Gainer': Zap,
    'Creatine': Award,
    'Pre-Workout': Zap
  };

  const handleAddToCart = (product: Product) => {
    const flavor = selectedFlavor || product.flavors[0];
    const size = selectedSize || product.sizes[0];
    
    addItem({
      productId: product.id,
      name: product.name,
      price: size.price,
      image: product.image,
      flavor,
      size: size.size,
      quantity: 1
    });

    toast.success(`Added ${product.name} to cart!`, {
      duration: 3000,
      style: {
        background: '#10b981',
        color: 'white',
      },
    });
  };

  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
    const IconComponent = categoryIcons[product.category] || Zap;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
        whileHover={{ y: -5 }}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-64">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay Icons */}
          <div className="absolute top-4 left-4">
            <motion.div
              className="bg-primary-500 text-white p-2 rounded-full"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent size={16} />
            </motion.div>
          </div>
          
          <motion.button
            className="absolute top-4 right-4 bg-white/90 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={16} />
          </motion.button>

          {/* Quick Add Button */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              variant="primary"
              size="sm"
              icon={ShoppingCart}
              onClick={() => handleAddToCart(product)}
            >
              Quick Add
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-500 font-medium">{product.category}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors duration-200">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Nutrition Highlights */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-primary-50 rounded-lg">
              <div className="text-primary-600 font-bold text-lg">{product.nutrition.protein}g</div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div className="text-center p-2 bg-accent-50 rounded-lg">
              <div className="text-accent-600 font-bold text-lg">{product.nutrition.calories}</div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
          </div>

          {/* Price and Sizes */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <span className="text-sm text-gray-500 ml-1">/ {product.sizes[0].size}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">{product.sizes.length} sizes</div>
              <div className="text-xs text-gray-500">{product.flavors.length} flavors</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedProduct(product)}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ShoppingCart}
              className="flex-1"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>
    );
  };

  return (
    <section id="products" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Premium
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent ml-2">
              Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scientifically formulated supplements to maximize your performance and results
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                    
                    {/* Detailed nutrition info, flavor/size selectors, etc. */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Select Flavor:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.flavors.map((flavor) => (
                            <button
                              key={flavor}
                              onClick={() => setSelectedFlavor(flavor)}
                              className={`px-4 py-2 rounded-lg border ${
                                selectedFlavor === flavor
                                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                                  : 'border-gray-300 hover:border-primary-300'
                              }`}
                            >
                              {flavor}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Select Size:</h4>
                        <div className="space-y-2">
                          {selectedProduct.sizes.map((size) => (
                            <button
                              key={size.size}
                              onClick={() => setSelectedSize(size.size)}
                              className={`w-full text-left p-3 rounded-lg border ${
                                selectedSize === size.size
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-300 hover:border-primary-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{size.size} ({size.servings} servings)</span>
                                <span className="font-bold">${size.price}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        variant="primary"
                        size="lg"
                        icon={ShoppingCart}
                        className="w-full"
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                      >
                        Add to Cart - ${selectedSize ? selectedProduct.sizes.find(s => s.size === selectedSize)?.price : selectedProduct.price}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductSection;