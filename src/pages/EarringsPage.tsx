import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DUMMY_EARRINGS = [
  { id: 'e1', name: 'Elegant Silver Studs', price: '₹2,499', image: '/dummy-images/earring1.jpg' },
  { id: 'e2', name: 'Classic Hoop Earrings', price: '₹3,199', image: '/dummy-images/earring2.jpg' },
  { id: 'e3', name: 'Pearl Drop Earrings', price: '₹2,899', image: '/dummy-images/earring3.jpg' },
  { id: 'e4', name: 'Minimalist Dangles', price: '₹2,299', image: '/dummy-images/earring4.jpg' },
];

const EarringsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-serif font-semibold mb-10 text-center text-gray-900">Earrings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {DUMMY_EARRINGS.map((item, idx) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow group relative flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="aspect-square bg-neutral-50 shimmer">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-serif font-medium text-gray-900 mb-2">{item.name}</h2>
                <p className="text-primary-600 font-semibold mb-4">{item.price}</p>
              </div>
              <button
                className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-lg transition-colors"
                onClick={() => navigate('/product', { state: { selectedImage: item.image, prompt: item.name } })}
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EarringsPage; 