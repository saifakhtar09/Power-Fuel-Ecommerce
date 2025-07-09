import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Dumbbell, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowRight,
  Shield,
  FileText,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';

const Footer: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const footerLinks = {
    products: [
      'Whey Protein',
      'Plant Protein',
      'Mass Gainers',
      'Pre-Workout',
      'Creatine',
      'Vitamins'
    ],
    support: [
      'FAQ',
      'Shipping Info',
      'Returns',
      'Contact Us',
      'Track Order',
      'Size Guide'
    ],
    company: [
      'About Us',
      'Careers',
      'Press',
      'Sustainability',
      'Reviews',
      'Affiliate Program'
    ],
    legal: [
      'Privacy Policy',
      'Terms of Service',
      'Return Policy',
      'Disclaimer',
      'Refund Policy'
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Youtube, href: '#', color: 'hover:text-red-500' }
  ];

  return (
    <footer className="bg-gray-900 text-white" ref={ref}>
      {/* Newsletter Section */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Get Exclusive Deals & Fitness Tips
          </motion.h3>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join 50,000+ athletes getting insider access to new products and training guides
          </motion.p>
          
          <motion.div
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              variant="secondary"
              icon={ArrowRight}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <motion.div
                  className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Dumbbell className="w-8 h-8 text-white" />
                </motion.div>
                <span className="text-2xl font-bold">PowerFuel</span>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Premium supplements designed for athletes who demand excellence. 
                Fuel your potential and transform your body with science-backed nutrition.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>+91-9876543210</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>support@powerfuel.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: (categoryIndex + 1) * 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-4 capitalize">
                  {category === 'legal' ? 'Legal' : category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: (categoryIndex + 1) * 0.1 + linkIndex * 0.05 }}
                    >
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                        whileHover={{ x: 5 }}
                      >
                        <span>{link}</span>
                        <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Compliance Section */}
      <motion.div
        className="border-t border-gray-800 py-8 bg-gray-800"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-primary-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">100% Authentic Products</h4>
                <p className="text-gray-400 text-sm">
                  We do not claim to be official distributors of any brand. All products are 100% original, sourced from authorized dealers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-primary-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">FSSAI Compliant</h4>
                <p className="text-gray-400 text-sm">
                  FSSAI License: [Pending Approval]. All products meet Indian food safety standards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RefreshCw className="w-6 h-6 text-primary-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">Easy Returns</h4>
                <p className="text-gray-400 text-sm">
                  30-day return policy on unopened products. Customer satisfaction guaranteed.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              <strong>Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration. 
              These products are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p>
              Results may vary. Consult your physician before starting any supplement regimen.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-800 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2025 PowerFuel. All rights reserved. Made with ❤️ for athletes in India.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map(({ icon: Icon, href, color }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  className={`text-gray-400 transition-colors duration-200 ${color}`}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;