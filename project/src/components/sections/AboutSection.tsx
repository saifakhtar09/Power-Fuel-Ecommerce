import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Zap, Shield, Leaf, Target } from 'lucide-react';

const AboutSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Third-party tested for purity and potency',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Trusted by Athletes',
      description: 'Used by professional athletes worldwide',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Fast Results',
      description: 'Notice improvements within days',
      color: 'from-green-400 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Safe & Natural',
      description: 'No artificial fillers or harmful additives',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Leaf,
      title: 'Sustainably Sourced',
      description: 'Environmentally responsible ingredients',
      color: 'from-emerald-400 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Goal Focused',
      description: 'Designed for specific fitness objectives',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent ml-2">
                PowerFuel?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're not just another supplement company. We're your partners in achieving 
              peak performance, backed by science and trusted by athletes worldwide.
            </p>
            
            <div className="space-y-6">
              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Science-Backed Formulas
                  </h3>
                  <p className="text-gray-600">
                    Every product is formulated based on the latest nutritional research 
                    and tested for maximum efficacy.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-secondary-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quality Assurance
                  </h3>
                  <p className="text-gray-600">
                    Manufactured in FDA-approved facilities with rigorous quality 
                    control at every step of production.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-accent-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Community Driven
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of athletes who trust our products to fuel 
                    their fitness journey and achieve their goals.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          {[
            { number: '50,000+', label: 'Happy Customers' },
            { number: '25+', label: 'Premium Products' },
            { number: '5★', label: 'Average Rating' },
            { number: '10+', label: 'Years Experience' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 1 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;