import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Gem, ShieldCheck, Truck, RefreshCcw, Star, Heart } from 'lucide-react';
import PromptInput from '../components/PromptInput';
import ImageGallery from '../components/ImageGallery';
import axios from 'axios';
import { cn } from '../utils/classNames';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import config from '../config';
import { storageService } from '../services/storage';
import { Design } from '../types';
import { motion } from 'framer-motion';

interface GenerationResponse {
  success: boolean;
  prompt: string;
  images: string[];
  message: string;
}

const DUMMY_IMAGE = '/dummy-images/ring1.jpg';

const CATEGORY_CARDS = [
  {
    name: 'Earrings',
    image: '/dummy-images/earring1.jpg',
    link: '/earrings',
  },
  {
    name: 'Bracelets',
    image: '/dummy-images/bracelet1.jpg',
    link: '/bracelets',
  },
  {
    name: 'Rings',
    image: '/dummy-images/ring1.jpg',
    link: '/rings',
  },
  {
    name: 'Necklaces',
    image: '/dummy-images/necklace1.jpg',
    link: '/necklaces',
  },
];

const WHY_FEATURES = [
  {
    icon: <ShieldCheck className="text-blue-400" size={32} />, 
    title: 'Certified Silver',
    desc: 'Every piece is crafted from certified 925 sterling silver for lasting shine.'
  },
  {
    icon: <Truck className="text-purple-400" size={32} />, 
    title: 'Free Shipping',
    desc: 'Enjoy free, insured shipping on every order, anywhere in India.'
  },
  {
    icon: <RefreshCcw className="text-green-400" size={32} />, 
    title: '15-Day Returns',
    desc: 'Shop with confidence—easy 15-day returns on all jewelry.'
  },
  {
    icon: <Sparkles className="text-pink-400" size={32} />, 
    title: 'AI-Personalized Designs',
    desc: 'Unique, AI-generated designs tailored to your imagination.'
  },
];

const HOW_STEPS = [
  { icon: <Sparkles className="text-blue-400" size={32} />, title: 'Describe Your Dream', desc: 'Tell us your vision for the perfect silver jewelry.' },
  { icon: <Gem className="text-purple-400" size={32} />, title: 'AI Designs for You', desc: 'Our AI creates stunning, unique designs just for you.' },
  { icon: <ArrowRight className="text-green-400" size={32} />, title: 'Order & Shine', desc: 'Choose your favorite, customize, and order with ease.' },
];

// Dummy carousel slides
const BANNER_SLIDES = [
  {
    image: '/dummy-images/hero-jewelry.png',
    title: 'AI-Designed Silver Jewelry',
    desc: 'Experience the future of jewelry with Gehnaz. Unique, personalized, and crafted for you.'
  },
  {
    image: '/dummy-images/bracelet1.jpg',
    title: 'New Arrivals',
    desc: 'Explore our latest silver creations, designed by AI and crafted by artisans.'
  },
  {
    image: '/dummy-images/earring1.jpg',
    title: 'Special Offers',
    desc: 'Enjoy exclusive deals on select silver jewelry pieces this season.'
  },
];

// Dummy reviews
const REVIEWS = [
  { name: 'Aarushi S.', stars: 5, text: 'Absolutely stunning! The AI design was unique and the quality is top-notch.' },
  { name: 'Mehul P.', stars: 4, text: 'Loved the customization and fast delivery. Will order again!' },
  { name: 'Riya K.', stars: 5, text: 'Gehnaz made my dream ring a reality. Highly recommended.' },
];

const TRENDING_PRODUCTS = [
  { id: 't1', name: 'Silver Infinity Ring', price: '₹2,499', image: '/dummy-images/ring2.jpg', stars: 5, badge: 'New' },
  { id: 't2', name: 'Pearl Drop Earrings', price: '₹3,199', image: '/dummy-images/earring3.jpg', stars: 4, badge: 'Bestseller' },
  { id: 't3', name: 'Minimalist Cuff', price: '₹2,799', image: '/dummy-images/bracelet2.jpg', stars: 5, badge: 'New' },
  { id: 't4', name: 'Heart Pendant Necklace', price: '₹2,999', image: '/dummy-images/necklace1.jpg', stars: 4, badge: '' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    // Load saved designs on component mount
    const designs = storageService.getDesigns();
    setSavedDesigns(designs);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNER_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePromptSubmit = async (promptText: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(promptText);
    setGeneratedImages([]);
    setProgress(0);
    setSelectedImage(null);
    
    try {
      const response = await axios.post<GenerationResponse>(
        `${config.apiUrl}/api/generate`,
        { prompt: promptText },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // Increased timeout to 2 minutes for multiple images
        }
      );
      
      if (response.data.success) {
        console.log('Received images:', response.data.images);
        setGeneratedImages(response.data.images);
        setProgress(100);
        showToast('Images generated successfully!', 'success');

        // Save the design
        const newDesign: Design = {
          id: `${crypto.randomUUID()}-${Date.now()}`,
          userId: 'guest', // We'll update this when we add authentication
          prompt: promptText,
          images: response.data.images,
          createdAt: new Date().toISOString(),
          status: 'draft'
        };
        
        storageService.saveDesign(newDesign);
        setSavedDesigns(prev => [...prev, newDesign]);
      } else {
        throw new Error(response.data.message || 'Failed to generate images');
      }
    } catch (err) {
      console.error('Error generating images:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          showToast('Request timed out. Please try again.', 'error');
        } else {
          showToast(err.response?.data?.message || 'Failed to generate images. Please try again.', 'error');
        }
      } else {
        showToast('Failed to generate images. Please try again.', 'error');
      }
      setGeneratedImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProductDetails = () => {
    if (selectedImage) {
      navigate('/product', { 
        state: { 
          selectedImage,
          prompt
        }
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-100">
      {/* Top Moving Banner/Carousel */}
      <section className="w-full bg-gradient-to-r from-blue-100 via-white to-purple-100 py-0 relative overflow-hidden">
        <div className="container mx-auto px-0">
          <motion.div
            key={bannerIdx}
            className="flex flex-col md:flex-row items-center justify-between gap-8 h-64 md:h-80 py-0 md:py-0 px-4 md:px-12 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md relative overflow-hidden"
            style={{ minHeight: '16rem', maxHeight: '20rem' }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.7 }}
          >
            <img src={BANNER_SLIDES[bannerIdx].image} alt={BANNER_SLIDES[bannerIdx].title} className="w-40 md:w-72 rounded-xl shadow-md object-contain h-40 md:h-64" />
            <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
              <h2 className="text-2xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-gray-400 bg-clip-text text-transparent shimmer">
                {BANNER_SLIDES[bannerIdx].title}
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-4 max-w-lg mx-auto md:mx-0">{BANNER_SLIDES[bannerIdx].desc}</p>
            </div>
          </motion.div>
          <div className="flex justify-center mt-4 gap-2">
            {BANNER_SLIDES.map((_: any, i: number) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${i === bannerIdx ? 'bg-primary-600' : 'bg-gray-300'} transition-colors`}
                onClick={() => setBannerIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center min-h-[60vh] py-16 md:py-24 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-semibold tracking-tight leading-tight text-gray-900 mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-gray-400 bg-clip-text text-transparent shimmer">AI-Designed</span> <span className="bg-gradient-to-r from-gray-400 via-blue-200 to-silver-400 bg-clip-text text-transparent shimmer">Silver</span> Jewelry
          </motion.h1>
          <motion.p
            className="text-2xl text-gray-700 leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Where your imagination meets luxury. Create unique silver jewelry with the power of AI.
          </motion.p>
          <motion.form
            className="flex items-center bg-white/70 backdrop-blur-md rounded-xl shadow-lg px-6 py-4 space-x-3 max-w-xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={e => { e.preventDefault(); handlePromptSubmit(prompt || ''); }}
          >
            <Sparkles className="text-blue-400 mr-2" size={28} />
            <input
              id="prompt-input"
              type="text"
              className="flex-1 border-none outline-none bg-transparent text-lg font-serif placeholder-gray-400"
              placeholder="Describe your dream jewelry..."
              value={prompt || ''}
              onChange={e => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              className="px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.06, boxShadow: '0 0 0 4px #b6b6e5' }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !(prompt && prompt.trim())}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {CATEGORY_CARDS.map((cat, idx) => (
              <motion.div
                key={cat.name}
                className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow group flex flex-col items-center p-6 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate(cat.link)}
              >
                <div className="aspect-square w-32 md:w-40 bg-neutral-50 shimmer mb-6 rounded-xl overflow-hidden flex items-center justify-center">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 mb-2">{cat.name}</h3>
                <button
                  className="mt-2 px-6 py-2 rounded-lg bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700 transition-colors"
                  onClick={e => { e.stopPropagation(); navigate(cat.link); }}
                >
                  Shop Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gehnaz Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12 text-gray-900">Why Gehnaz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {WHY_FEATURES.map((f, idx) => (
              <motion.div
                key={f.title}
                className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-soft p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {HOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.title}
                className="bg-white rounded-2xl shadow-soft p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="mb-2">{step.icon}</div>
                <h3 className="text-base font-serif font-medium text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Carousel */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12 text-gray-900">What Our Customers Say</h2>
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={bannerIdx}
              className="flex flex-col md:flex-row items-center justify-center gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {REVIEWS.map((r: any, i: number) => (
                <div key={r.name} className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-soft p-8 flex-1 mx-2 flex flex-col items-center text-center">
                  <div className="flex mb-2">
                    {[...Array(r.stars)].map((_: any, j: number) => <Star key={j} className="text-yellow-400" size={20} />)}
                  </div>
                  <p className="text-gray-700 text-base mb-4">“{r.text}”</p>
                  <span className="text-sm text-gray-500 font-serif">{r.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container">
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4 text-gray-900">Stay in Touch</h2>
            <p className="text-gray-600 text-center mb-6">Get exclusive offers, new arrivals, and AI jewelry inspiration in your inbox.</p>
            <form className="w-full flex flex-col sm:flex-row gap-4 items-center" onSubmit={e => { e.preventDefault(); }}>
              <input
                type="email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow focus:ring-2 focus:ring-blue-200 text-lg font-serif placeholder-gray-400"
                placeholder="Your email address"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* Saved Designs Section */}
      {savedDesigns.length > 0 && (
        <section className="py-16 bg-neutral-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-serif font-semibold mb-8 text-gray-900">Your Saved Designs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedDesigns.map((design, idx) => (
                  <motion.div
                    key={design.id}
                    className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow group relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="aspect-square bg-neutral-50 shimmer">
                      <img 
                        src={design.images[0] || DUMMY_IMAGE} 
                        alt={design.prompt}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                          onClick={() => {
                            setSelectedImage(design.images[0] || DUMMY_IMAGE);
                            setPrompt(design.prompt);
                            navigate('/product', {
                              state: {
                                selectedImage: design.images[0] || DUMMY_IMAGE,
                                prompt: design.prompt
                              }
                            });
                          }}
                          className="bg-white/80 hover:bg-primary-100 text-primary-600 rounded-full p-2 shadow-md"
                          title="View Details"
                        >
                          <ArrowRight size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSavedDesigns(prev => prev.filter(d => d.id !== design.id));
                            storageService.deleteDesign(design.id);
                          }}
                          className="bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-2 shadow-md"
                          title="Delete Design"
                        >
                          <span className="sr-only">Delete</span>
                          &#10005;
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                        {design.prompt}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedImage(design.images[0] || DUMMY_IMAGE);
                          setPrompt(design.prompt);
                          navigate('/product', {
                            state: {
                              selectedImage: design.images[0] || DUMMY_IMAGE,
                              prompt: design.prompt
                            }
                          });
                        }}
                        className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Now Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 text-gray-900">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {TRENDING_PRODUCTS.map((prod, idx) => (
              <motion.div
                key={prod.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow group flex flex-col items-center p-6 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="aspect-square w-32 md:w-40 bg-neutral-50 mb-4 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" loading="lazy" />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{prod.badge}</span>
                  )}
                  <button
                    aria-label={wishlist.includes(prod.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-primary-100 transition-colors ${wishlist.includes(prod.id) ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => setWishlist(wishlist => wishlist.includes(prod.id) ? wishlist.filter(id => id !== prod.id) : [...wishlist, prod.id])}
                  >
                    <Heart size={20} fill={wishlist.includes(prod.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-1 text-center">{prod.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(prod.stars)].map((_, i) => <Star key={i} className="text-yellow-400" size={16} />)}
                </div>
                <p className="text-primary-600 font-semibold mb-2">{prod.price}</p>
                <button
                  className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-lg transition-colors mt-auto"
                  onClick={() => navigate('/product', { state: { selectedImage: prod.image, prompt: prod.name, price: prod.price } })}
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, number }) => {
  return (
    <div className="bg-card p-8 relative group hover:shadow-lg transition-shadow">
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium shadow-md border border-primary-200">
        {number}
      </div>
      <div className="mb-4 text-primary-600">{icon}</div>
      <h3 className="text-xl font-serif mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-900">{description}</p>
    </div>
  );
};

export default HomePage;