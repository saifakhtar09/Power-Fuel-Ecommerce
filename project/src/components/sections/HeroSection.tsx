import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Play, Zap, Award, Users, Dumbbell, Target, TrendingUp, Shield } from 'lucide-react';
import Button from '../ui/Button';
import ParticleSystem from '../ui/ParticleSystem';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);

  const powerWords = ["STRENGTH", "POWER", "MUSCLE", "GAINS", "BEAST MODE"];
  const fullText = "UNLEASH YOUR POTENTIAL";

  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % powerWords.length);
    }, 2000);

    return () => clearInterval(wordInterval);
  }, []);

  const floatingElements = [
    { icon: Zap, delay: 0.2, x: '10%', y: '20%', color: 'text-yellow-400' },
    { icon: Award, delay: 0.4, x: '85%', y: '25%', color: 'text-orange-400' },
    { icon: Users, delay: 0.6, x: '15%', y: '75%', color: 'text-blue-400' },
    { icon: Target, delay: 0.8, x: '80%', y: '70%', color: 'text-green-400' },
    { icon: TrendingUp, delay: 1.0, x: '5%', y: '50%', color: 'text-purple-400' },
    { icon: Dumbbell, delay: 1.2, x: '90%', y: '45%', color: 'text-red-400' },
  ];

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y, opacity, scale }}
    >
      {/* Dynamic Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent-500/30 to-primary-500/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -40, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-secondary-500/20 to-accent-500/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Particle System */}
      <ParticleSystem 
        className="opacity-40"
        particleCount={120}
        colors={['rgba(0, 102, 255, 0.6)', 'rgba(255, 107, 53, 0.6)', 'rgba(16, 185, 129, 0.4)', 'rgba(255, 255, 255, 0.3)']}
      />

      {/* Athletic Background Image */}
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute right-0 top-0 w-1/2 h-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative w-full h-full">
            {/* Athlete Image */}
            <motion.img
              src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Athletic Bodybuilder"
              className="w-full h-full object-cover object-center"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/80" />
            
            {/* Dynamic Light Effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 z-20">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: element.x, top: element.y }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: [0.4, 0.8, 0.4], 
              scale: 1,
              y: [0, -30, 0],
              rotate: [0, 360, 0]
            }}
            transition={{ 
              delay: element.delay,
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className={`p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 ${element.color}`}
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <element.icon className="w-6 h-6" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-30 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Power Word Animation */}
          <motion.div
            className="mb-6"
            key={currentWordIndex}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm rounded-full border border-primary-500/30 text-primary-400 font-bold text-lg tracking-wider">
              {powerWords[currentWordIndex]}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {typedText}
              <motion.span
                className="inline-block w-1 h-16 bg-secondary-500 ml-2"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              TRANSFORM YOUR BODY
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Premium protein powders and supplements designed for athletes who demand excellence. 
            <span className="text-primary-400 font-semibold"> Fuel your workouts, accelerate recovery, and achieve your fitness goals.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="min-w-[220px] relative overflow-hidden group bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-2xl"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10">SHOP NOW</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                icon={Play}
                className="min-w-[220px] border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
              >
                WATCH TRANSFORMATION
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {[
              { number: '50K+', label: 'Athletes Transformed', icon: Users },
              { number: '25+', label: 'Premium Products', icon: Award },
              { number: '4.9★', label: 'Customer Rating', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="flex items-center justify-center mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + index * 0.2 }}
                >
                  <stat.icon className="w-6 h-6 text-primary-400 mr-2" />
                  <div className="text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {stat.number}
                  </div>
                </motion.div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Enhanced Visual Elements */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center space-y-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {/* Floating Product Showcase */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-64 h-64 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Dumbbell className="w-16 h-16 text-white mx-auto mb-4" />
                <div className="text-white font-bold text-xl">PREMIUM</div>
                <div className="text-primary-400 font-semibold">SUPPLEMENTS</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <div className="flex space-x-4">
            {[
              { icon: Award, label: 'Lab Tested', color: 'from-yellow-400 to-orange-500' },
              { icon: Shield, label: 'FDA Approved', color: 'from-green-400 to-blue-500' },
              { icon: Zap, label: 'Fast Results', color: 'from-purple-400 to-pink-500' }
            ].map((badge, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl bg-gradient-to-r ${badge.color} text-white text-center min-w-[100px]`}
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 2.5 + index * 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <badge.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xs font-bold">{badge.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center mb-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.p 
            className="text-white/70 text-sm font-medium tracking-wider"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Animated Border Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 3.5, duration: 2 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 4, duration: 2 }}
      />
    </motion.section>
  );
};

export default HeroSection;