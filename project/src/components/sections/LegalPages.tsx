import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield, RefreshCw, AlertTriangle } from 'lucide-react';

interface LegalPagesProps {
  isOpen: boolean;
  onClose: () => void;
  page: 'terms' | 'privacy' | 'return' | 'disclaimer' | null;
}

const LegalPages: React.FC<LegalPagesProps> = ({ isOpen, onClose, page }) => {
  const renderContent = () => {
    switch (page) {
      case 'terms':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-8 h-8 text-primary-500" />
              <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using PowerFuel's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Product Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We strive to provide accurate product information, including descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All products are 100% authentic and sourced from authorized dealers</li>
                  <li>We do not claim to be official distributors of any brand</li>
                  <li>Product images are for illustration purposes only</li>
                  <li>Actual product packaging may vary from images shown</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Ordering and Payment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you place an order, you are making an offer to purchase the product(s) at the price stated. We reserve the right to accept or decline your order.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                  <li>Payment must be made at the time of ordering (except COD)</li>
                  <li>We accept credit cards, debit cards, UPI, net banking, and cash on delivery</li>
                  <li>COD orders require phone verification within 24 hours</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Free shipping on orders above ₹999</li>
                  <li>COD charges of ₹50 apply for cash on delivery orders</li>
                  <li>We are not responsible for delays due to unforeseen circumstances</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  PowerFuel shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms & Conditions, please contact us at:
                  <br />
                  Email: support@powerfuel.com
                  <br />
                  Phone: +91-9876543210
                </p>
              </section>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-primary-500" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third parties)</li>
                  <li>Order history and preferences</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders</li>
                  <li>Provide customer support</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With service providers who help us operate our business</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </section>
            </div>
          </div>
        );

      case 'return':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <RefreshCw className="w-8 h-8 text-primary-500" />
              <h1 className="text-3xl font-bold text-gray-900">Return & Refund Policy</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Return Eligibility</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We want you to be completely satisfied with your purchase. You may return items within 30 days of delivery for a full refund.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items must be unopened and in original packaging</li>
                  <li>Products must be in resaleable condition</li>
                  <li>Return request must be initiated within 30 days of delivery</li>
                  <li>Original receipt or order confirmation required</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Non-Returnable Items</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Opened or used supplement products (for health and safety reasons)</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Products returned after 30 days</li>
                  <li>Items without original packaging</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Return Process</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Contact our customer service team at support@powerfuel.com</li>
                  <li>Provide your order number and reason for return</li>
                  <li>Receive return authorization and shipping label</li>
                  <li>Package items securely in original packaging</li>
                  <li>Ship using provided prepaid return label</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Refund Processing</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Refunds processed within 5-7 business days after receiving returned items</li>
                  <li>Refunds issued to original payment method</li>
                  <li>Shipping charges are non-refundable (except for defective items)</li>
                  <li>COD orders refunded via bank transfer or store credit</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Exchanges</h2>
                <p className="text-gray-700 leading-relaxed">
                  We currently do not offer direct exchanges. To exchange an item, please return the original item for a refund and place a new order for the desired product.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Damaged or Defective Items</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you receive a damaged or defective item:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Contact us immediately with photos of the damage</li>
                  <li>We will provide a prepaid return label</li>
                  <li>Full refund or replacement will be provided</li>
                  <li>No return shipping charges for defective items</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For return requests or questions about our return policy:
                  <br />
                  Email: support@powerfuel.com
                  <br />
                  Phone: +91-9876543210
                  <br />
                  Hours: Monday-Friday, 9 AM - 6 PM IST
                </p>
              </section>
            </div>
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Product Authenticity</h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-semibold">
                    IMPORTANT: We do not claim to be official distributors of any brand. All products sold on PowerFuel are 100% original and authentic, sourced from authorized dealers and distributors.
                  </p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All products are genuine and sourced from legitimate suppliers</li>
                  <li>We verify authenticity through authorized distribution channels</li>
                  <li>Product packaging may vary from official brand websites</li>
                  <li>We are an independent retailer, not affiliated with product manufacturers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Health and Safety Disclaimer</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-semibold">
                    These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
                  </p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Consult your physician before starting any supplement regimen</li>
                  <li>Individual results may vary</li>
                  <li>Not suitable for pregnant or nursing women without medical approval</li>
                  <li>Keep out of reach of children</li>
                  <li>Discontinue use if adverse reactions occur</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. FSSAI Compliance</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  PowerFuel is committed to food safety and regulatory compliance:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>FSSAI License: [Application Pending - License Number will be updated upon approval]</li>
                  <li>All products meet Indian food safety standards</li>
                  <li>Regular quality checks and compliance monitoring</li>
                  <li>Proper storage and handling procedures followed</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Website Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The information on this website is provided for educational purposes only:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Product information is based on manufacturer specifications</li>
                  <li>Nutritional information may vary between batches</li>
                  <li>Images are for illustration purposes only</li>
                  <li>We strive for accuracy but cannot guarantee error-free content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Age Restrictions</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Products are intended for adults 18 years and older</li>
                  <li>Minors should not use these products without parental guidance</li>
                  <li>Consult healthcare provider for individuals under 18</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  PowerFuel shall not be held liable for any adverse effects, injuries, or damages resulting from the use of products purchased from our website. Users assume full responsibility for proper usage and consultation with healthcare professionals.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or policies of these external sites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about this disclaimer or our products:
                  <br />
                  Email: support@powerfuel.com
                  <br />
                  Phone: +91-9876543210
                  <br />
                  Address: Mumbai, Maharashtra, India
                </p>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && page && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Legal Information</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LegalPages;