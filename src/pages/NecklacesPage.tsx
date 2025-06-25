import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DUMMY_NECKLACES = [
  { id: 'n1', name: 'Silver Heart Pendant', price: '₹2,999', image: '/dummy-images/necklace1.jpg' },
  { id: 'n2', name: 'Minimalist Bar Necklace', price: '₹2,499', image: '/dummy-images/necklace2.jpg' },
  { id: 'n3', name: 'Pearl Choker', price: '₹3,499', image: '/dummy-images/necklace3.jpg' },
  { id: 'n4', name: 'Infinity Lariat', price: '₹2,799', image: '/dummy-images/necklace4.jpg' },
];

const NecklacesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-serif font-semibold mb-10 text-center text-gray-900">Necklaces</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {DUMMY_NECKLACES.map((item, idx) => (
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

export default NecklacesPage; 