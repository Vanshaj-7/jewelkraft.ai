import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storage';
import ProductForm from '../components/ProductForm';
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationState {
  selectedImage: string;
  prompt: string;
}

const DUMMY_IMAGE = '/dummy-images/ring1.jpg';

const RELATED_PRODUCTS = [
  { id: 'r1', name: 'Twisted Infinity Ring', price: '₹2,499', image: '/dummy-images/ring2.jpg', stars: 5 },
  { id: 'r2', name: 'Classic Hoop Earrings', price: '₹3,199', image: '/dummy-images/earring2.jpg', stars: 4 },
  { id: 'r3', name: 'Minimalist Bar Necklace', price: '₹2,499', image: '/dummy-images/necklace2.jpg', stars: 5 },
];

const ProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedImage, prompt } = (location.state as LocationState) || {};
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_savedProduct, setSavedProduct] = useState<Product | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const imageToShow = selectedImage || DUMMY_IMAGE;

  useEffect(() => {
    if (!selectedImage) {
      navigate('/');
      return;
    }

    // Check if there's a saved product for this design
    const products = storageService.getProducts();
    const savedProductItem = products.find(p => p.designId === prompt);
    if (savedProductItem) {
      setSavedProduct(savedProductItem);
    }

    setIsLoading(false);
  }, [selectedImage, prompt, navigate]);

  const handleSaveProduct = (product: Product) => {
    setSavedProduct(product);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Custom Jewelry Design',
        text: prompt,
        url: window.location.href
      });
      showToast('Shared successfully!', 'success');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        showToast('Failed to share. Please try again.', 'error');
      }
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      'success'
    );
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container py-12">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Designs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              className="aspect-square bg-neutral-50 rounded-lg overflow-hidden relative group"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <img 
                src={imageToShow} 
                alt="Selected jewelry design" 
                className="w-full h-full object-contain shimmer"
                style={{ transition: 'box-shadow 0.3s' }}
              />
              <div className="absolute inset-0 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-gradient-to-t from-white/60 to-transparent" />
            </motion.div>
            {prompt && (
              <motion.div
                className="mt-4 p-4 bg-neutral-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-serif font-medium text-neutral-700 mb-2">Design Description</h3>
                <p className="text-neutral-600 text-base">{prompt}</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-serif font-semibold">Custom Jewelry Design</h1>
                <div className="flex items-center space-x-4">
                  <motion.button
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="absolute top-4 right-4 z-10"
                    onClick={handleWishlist}
                    whileTap={{ scale: 1.3 }}
                    animate={{ color: isWishlisted ? '#e11d48' : '#64748b', scale: isWishlisted ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Heart fill={isWishlisted ? '#e11d48' : 'none'} className="w-7 h-7" />
                  </motion.button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>
            
            <ProductForm 
              designId={prompt || ''} 
              onSave={handleSaveProduct}
            />
          </motion.div>
        </div>

        {/* You May Also Like Section */}
        <section className="py-12 bg-gradient-to-b from-white to-blue-50 mt-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 text-gray-900">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {RELATED_PRODUCTS.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow group flex flex-col items-center p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="aspect-square w-32 md:w-40 bg-neutral-50 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-1 text-center">{prod.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(prod.stars)].map((_, i) => <Star key={i} className="text-yellow-400" size={16} />)}
                  </div>
                  <p className="text-primary-600 font-semibold mb-2">{prod.price}</p>
                  <motion.button
                    className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-lg transition-colors mt-auto"
                    whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/product', { state: { selectedImage: prod.image, prompt: prod.name, price: prod.price } })}
                  >
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Storytelling Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white mt-12">
          <motion.div
            className="container max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-1 flex justify-center mb-8 md:mb-0">
              <img
                src="/dummy-images/necklace1.jpg"
                alt="Handcrafted silver jewelry from Gehnaz"
                className="rounded-2xl shadow-lg w-64 h-64 object-cover object-center border-4 border-white"
                loading="lazy"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">The Gehnaz Story</h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 font-light">
                At <span className="font-semibold text-primary-700">Gehnaz</span>, every piece is a celebration of artistry, heritage, and the timeless allure of silver. Our journey began with a passion for crafting jewelry that tells your story—pieces that become heirlooms, cherished for generations.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-6">
                Inspired by the elegance of tradition and the spirit of modernity, we blend meticulous craftsmanship with innovative design. Each creation is thoughtfully made, reflecting the dreams and individuality of those who wear it. Welcome to your silver abode—where every jewel is a promise of beauty, authenticity, and love.
              </p>
              <span className="inline-block text-primary-700 font-semibold tracking-wide text-lg mt-2">— Your Silver Abode</span>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default ProductPage;