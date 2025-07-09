import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Dumbbell, 
  LogOut,
  Heart,
  Gift,
  Headphones,
  RefreshCw,
  UserCheck,
  Settings,
  FileText,
  ChevronDown
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import AuthModal from '../auth/AuthModal';
import UserProfile from '../profile/UserProfile';
import LegalPages from '../sections/LegalPages';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showLegalDropdown, setShowLegalDropdown] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'return' | 'disclaimer' | null>(null);
  const { toggleCart, getItemCount } = useCartStore();
  const { user, signOut } = useAuthStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Products', href: '#products' },
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Coupons', href: '#coupons' },
    { name: 'Legal', href: '#legal', isDropdown: true }
  ];

  const userMenuItems = [
    { name: 'My Profile', href: '#profile', icon: User },
    { name: 'Wishlist', href: '#wishlist', icon: Heart },
    { name: 'Loyalty Program', href: '#loyalty', icon: Gift },
    { name: 'Returns', href: '#returns', icon: RefreshCw },
    { name: 'Support', href: '#support', icon: Headphones },
    { name: 'Affiliate Program', href: '#affiliate', icon: UserCheck },
  ];

  const legalMenuItems = [
    { name: 'Terms & Conditions', page: 'terms' as const },
    { name: 'Privacy Policy', page: 'privacy' as const },
    { name: 'Return Policy', page: 'return' as const },
    { name: 'Disclaimer', page: 'disclaimer' as const }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      window.location.hash = '';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNavigation = (href: string) => {
    if (href === '#profile') {
      setShowProfile(true);
      setShowUserMenu(false);
    } else {
      window.location.hash = href.replace('#', '');
      setShowUserMenu(false);
      setIsMenuOpen(false);
    }
  };

  const handleLegalClick = (page: 'terms' | 'privacy' | 'return' | 'disclaimer') => {
    setLegalPage(page);
    setShowLegal(true);
    setShowLegalDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => window.location.hash = ''}
            >
              <motion.div
                className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Dumbbell className="w-6 h-6 text-white" />
              </motion.div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                PowerFuel
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.isDropdown ? (
                    <div className="relative">
                      <motion.button
                        className={`relative font-medium transition-colors duration-200 flex items-center space-x-1 ${
                          isScrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white hover:text-secondary-300'
                        }`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setShowLegalDropdown(!showLegalDropdown)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {showLegalDropdown && (
                          <motion.div
                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {legalMenuItems.map((legal) => (
                              <button
                                key={legal.page}
                                onClick={() => handleLegalClick(legal.page)}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                              >
                                <FileText className="w-4 h-4" />
                                <span>{legal.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.a
                      href={item.href}
                      className={`relative font-medium transition-colors duration-200 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white hover:text-secondary-300'
                      }`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ y: -2 }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.href === '#coupons') {
                          window.location.hash = 'coupons';
                        } else {
                          const element = document.querySelector(item.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {item.name}
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.a>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                onClick={toggleCart}
                className={`relative p-2 rounded-full transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User */}
              <div className="relative">
                <motion.button
                  onClick={() => user ? setShowUserMenu(!showUserMenu) : setShowAuth(true)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5" />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {user && showUserMenu && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      {userMenuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </button>
                      ))}
                      
                      {/* Admin Panel (only for admin users) */}
                      {user.email === 'admin@powerfuel.com' && (
                        <button
                          onClick={() => {
                            window.location.pathname = '/admin';
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-t"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-3 border-t"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-md ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-gray-200 bg-white"
              >
                <div className="py-4 space-y-2">
                  {navItems.map((item, index) => (
                    <div key={item.name}>
                      {item.isDropdown ? (
                        <div>
                          <button
                            onClick={() => setShowLegalDropdown(!showLegalDropdown)}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {showLegalDropdown && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 space-y-1"
                              >
                                {legalMenuItems.map((legal) => (
                                  <button
                                    key={legal.page}
                                    onClick={() => handleLegalClick(legal.page)}
                                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm"
                                  >
                                    {legal.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <motion.a
                          href={item.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </motion.a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Legal Pages Modal */}
      <LegalPages
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        page={legalPage}
      />
    </>
  );
};

export default Header;