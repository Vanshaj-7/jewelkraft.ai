import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-16">
    <div className="container max-w-3xl mx-auto">
      <motion.h1
        className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 text-gray-900"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        About Gehnaz
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-700 text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Gehnaz is your silver abode—where tradition meets technology. We blend the timeless beauty of silver jewelry with the power of AI to create unique, personalized pieces for every occasion.
      </motion.p>
      <motion.div
        className="bg-white rounded-2xl shadow-soft p-8 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <h2 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          At Gehnaz, we believe jewelry should be as unique as you are. Our AI-driven platform empowers you to design your dream piece, which is then brought to life by master artisans using certified 925 sterling silver.
        </p>
        <p className="text-gray-700">
          We are committed to quality, transparency, and innovation—making luxury accessible, personal, and sustainable.
        </p>
      </motion.div>
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <span className="text-primary-600 font-serif text-lg">Gehnaz — Your Silver Abode</span>
      </motion.div>
    </div>
  </div>
);

export default AboutPage; 