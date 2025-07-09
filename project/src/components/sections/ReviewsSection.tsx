import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const ReviewsSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Professional Athlete',
      rating: 5,
      review: 'PowerFuel has completely transformed my training. The quality is unmatched and the results speak for themselves. I\'ve gained lean muscle while maintaining my energy levels throughout intense sessions.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Fitness Enthusiast',
      rating: 5,
      review: 'Been using PowerFuel for over a year now. The taste is amazing and it mixes perfectly. I\'ve tried many brands but nothing comes close to the quality and effectiveness of these products.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Nutritionist',
      rating: 5,
      review: 'As a nutritionist, I\'m very particular about supplement quality. PowerFuel\'s transparency about ingredients and third-party testing gives me confidence to recommend it to my clients.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      id: 4,
      name: 'David Rodriguez',
      role: 'Powerlifter',
      rating: 5,
      review: 'The mass gainer is incredible! I\'ve put on 15 pounds of quality muscle in 3 months. The recovery time has improved dramatically and I can train harder than ever before.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Wang',
      role: 'Yoga Instructor',
      rating: 5,
      review: 'The plant-based protein is perfect for my lifestyle. It\'s clean, tastes great, and provides everything I need for muscle recovery after my classes. Highly recommend!',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'CrossFit Coach',
      rating: 5,
      review: 'PowerFuel is what I recommend to all my athletes. The pre-workout gives incredible energy without the crash, and the protein aids in perfect recovery. Game changer!',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    }
  ];

  const ReviewCard: React.FC<{ review: typeof reviews[0]; index: number }> = ({ review, index }) => (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 bg-primary-500 rounded-full p-3">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
          >
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        "{review.review}"
      </p>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <motion.img
          src={review.image}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            {review.verified && (
              <motion.div
                className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                ✓ Verified
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500">{review.role}</p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 1.5 }}
      />
    </motion.div>
  );

  return (
    <section id="reviews" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent ml-2">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real athletes and fitness enthusiasts 
            have to say about PowerFuel products.
          </p>

          {/* Overall Rating */}
          <motion.div
            className="mt-8 inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={inView ? { opacity: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </motion.div>
              ))}
            </div>
            <div className="text-2xl font-bold text-gray-900">4.9</div>
            <div className="text-gray-600">Based on 2,847+ reviews</div>
          </motion.div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '50,000+', label: 'Happy Customers' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '2,847+', label: 'Verified Reviews' },
              { number: '98%', label: 'Would Recommend' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;