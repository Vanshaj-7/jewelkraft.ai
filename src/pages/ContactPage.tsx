import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-16">
      <div className="container max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-700 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Have a question, feedback, or a custom request? Reach out to Gehnaz — we'd love to hear from you!
        </motion.p>
        <motion.form
          className="bg-white rounded-2xl shadow-soft p-8 mb-8 flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
        >
          <input type="text" placeholder="Your Name" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400" required />
          <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400" required />
          <textarea placeholder="Your Message" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400 min-h-[120px]" required />
          <motion.button
            type="submit"
            className="px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors mt-2"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
          {submitted && <div className="text-green-600 mt-2">Thank you! We'll get back to you soon.</div>}
        </motion.form>
        <motion.div
          className="bg-white rounded-2xl shadow-soft p-8 mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-xl font-serif font-semibold mb-2 text-gray-900">Contact Information</h2>
          <p className="text-gray-700 mb-1">Email: <a href="mailto:contact@gehnaz.com" className="text-primary-600 underline">contact@gehnaz.com</a></p>
          <p className="text-gray-700 mb-1">Phone: +91 98765 43210</p>
          <p className="text-gray-700">Address: 123 Silver Lane, Mumbai, India</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-soft p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-xl font-serif font-semibold mb-2 text-gray-900">Our Location</h2>
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">[Map Placeholder]</div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 