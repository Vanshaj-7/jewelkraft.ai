import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storage';
import ProductForm from '../components/ProductForm';
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface LocationState {
  selectedImage: string;
  prompt: string;
}

const ProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedImage, prompt } = (location.state as LocationState) || {};
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_savedProduct, setSavedProduct] = useState<Product | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    <div className="bg-white">
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
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-50 rounded-lg overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected jewelry design" 
                className="w-full h-full object-contain"
              />
            </div>
            {prompt && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Design Description</h3>
                <p className="text-neutral-600">{prompt}</p>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif">Custom Jewelry Design</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                  </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;