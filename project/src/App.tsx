import React, { useEffect, useState, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Analytics, trackPerformance } from './utils/analytics';
import { ErrorHandler } from './utils/errorHandler';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import SEOHead from './components/common/SEOHead';

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/layout/Header'));
const HeroSection = React.lazy(() => import('./components/sections/HeroSection'));
const ProductSection = React.lazy(() => import('./components/sections/ProductSection'));
const AboutSection = React.lazy(() => import('./components/sections/AboutSection'));
const ReviewsSection = React.lazy(() => import('./components/sections/ReviewsSection'));
const Footer = React.lazy(() => import('./components/sections/Footer'));
const ShoppingCart = React.lazy(() => import('./components/cart/ShoppingCart'));

// Feature Components
const LoyaltyProgram = React.lazy(() => import('./components/features/LoyaltyProgram'));
const AffiliateProgram = React.lazy(() => import('./components/features/AffiliateProgram'));
const ReturnManagement = React.lazy(() => import('./components/features/ReturnManagement'));
const CustomerSupport = React.lazy(() => import('./components/features/CustomerSupport'));
const WishlistManager = React.lazy(() => import('./components/features/WishlistManager'));
const CouponManager = React.lazy(() => import('./components/features/CouponManager'));

// Admin Components
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));

function App() {
  const { setUser, user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize analytics
    Analytics.init();
    trackPerformance();

    // Check initial auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          ErrorHandler.handle(error, 'Auth initialization');
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
            created_at: session.user.created_at
          });
          Analytics.trackLogin('email', session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        ErrorHandler.handle(error, 'Auth initialization');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
            created_at: session.user.created_at
          });
          Analytics.trackLogin('email', session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentPage('home');
        } else if (event === 'SIGNED_UP' && session?.user) {
          Analytics.trackSignUp('email', session.user.id);
        }
      } catch (error) {
        ErrorHandler.handle(error, 'Auth state change');
      }
    });

    // Handle URL routing
    const handleRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (path.includes('/admin')) {
        setCurrentPage('admin');
      } else if (hash === '#loyalty') {
        setCurrentPage('loyalty');
      } else if (hash === '#affiliate') {
        setCurrentPage('affiliate');
      } else if (hash === '#returns') {
        setCurrentPage('returns');
      } else if (hash === '#support') {
        setCurrentPage('support');
      } else if (hash === '#wishlist') {
        setCurrentPage('wishlist');
      } else if (hash === '#coupons') {
        setCurrentPage('coupons');
      } else {
        setCurrentPage('home');
      }

      // Track page views
      Analytics.trackPageView(currentPage, user?.id);
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);

    // Service Worker registration
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(() => console.log('SW registration failed'));
    }

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, [setUser, user?.id, currentPage]);

  const renderPage = () => {
    const isAdmin = user?.email === 'admin@powerfuel.com';

    switch (currentPage) {
      case 'admin':
        return isAdmin ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading admin panel..." />}>
            <AdminPanel />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Access Denied</p>
          </div>
        );
      case 'loyalty':
        return user ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading loyalty program..." />}>
            <LoyaltyProgram />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Please sign in to access loyalty program</p>
          </div>
        );
      case 'affiliate':
        return user ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading affiliate program..." />}>
            <AffiliateProgram />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Please sign in to access affiliate program</p>
          </div>
        );
      case 'returns':
        return user ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading returns..." />}>
            <ReturnManagement />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Please sign in to manage returns</p>
          </div>
        );
      case 'support':
        return user ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading support..." />}>
            <CustomerSupport />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Please sign in to access support</p>
          </div>
        );
      case 'wishlist':
        return user ? (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading wishlist..." />}>
            <WishlistManager />
          </Suspense>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Please sign in to view wishlist</p>
          </div>
        );
      case 'coupons':
        return (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading coupons..." />}>
            <CouponManager />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
            <Header />
            <main>
              <HeroSection />
              <ProductSection />
              <AboutSection />
              <ReviewsSection />
            </main>
            <Footer />
            <ShoppingCart />
          </Suspense>
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen variant="branded" message="Initializing PowerFuel..." />;
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-white">
          <SEOHead />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                maxWidth: '400px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
              loading: {
                duration: Infinity,
              },
            }}
          />

          {renderPage()}
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;