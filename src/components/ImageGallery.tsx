import React, { useState, useEffect } from 'react';
import { cn } from '../utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, Loader } from 'lucide-react';

const DUMMY_IMAGES = [
  '/dummy-images/ring1.jpg',
  '/dummy-images/necklace1.jpg',
  '/dummy-images/earring1.jpg',
  '/dummy-images/bracelet1.jpg',
  '/dummy-images/ring2.jpg',
  '/dummy-images/necklace2.jpg',
];

interface ImageGalleryProps {
  images?: string[];
  isLoading?: boolean;
  onProgress?: (progress: number) => void;
  onImageSelect?: (image: string) => void;
  useDummy?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], isLoading = false, onProgress, onImageSelect, useDummy = false }) => {
  const galleryImages = useDummy ? DUMMY_IMAGES : (images.length > 0 ? images : DUMMY_IMAGES);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    galleryImages.length > 0 ? galleryImages[0] : null
  );
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [shimmerActive, setShimmerActive] = useState<boolean[]>(galleryImages.map(() => true));
  
  // Update selected image when new images arrive
  useEffect(() => {
    if (galleryImages.length > 0 && !isLoading) {
      setSelectedImage(galleryImages[0]);
      setImageLoadError(null);
    }
  }, [galleryImages, isLoading]);

  // Update progress as images load
  useEffect(() => {
    if (onProgress && galleryImages.length > 0) {
      const progress = (loadedImages.size / galleryImages.length) * 100;
      onProgress(Math.round(progress));
    }
  }, [loadedImages, galleryImages.length, onProgress]);

  // Notify parent of image selection
  useEffect(() => {
    if (selectedImage && onImageSelect) {
      onImageSelect(selectedImage);
    }
  }, [selectedImage, onImageSelect]);

  useEffect(() => {
    setShimmerActive(galleryImages.map(() => true));
    const timer = setTimeout(() => {
      setShimmerActive(galleryImages.map(() => false));
    }, 2000);
    return () => clearTimeout(timer);
  }, [galleryImages.join(',')]);

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  const handleImageError = (error: string) => {
    console.error('Image loading error:', error);
    setImageLoadError('Failed to load image. Please try again.');
  };

  const handleDownload = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    try {
      setIsDownloading(true);
      
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Generate a filename based on the current timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `jewelry-design-${timestamp}.png`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
      setImageLoadError('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading && galleryImages.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="aspect-square rounded-lg bg-neutral-100 animate-pulse flex items-center justify-center"
          >
            <Loader className="text-neutral-300 animate-spin" size={32} />
          </div>
        ))}
      </div>
    );
  }

  if (galleryImages.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No images generated yet. Enter a prompt to create jewelry designs.</p>
      </div>
    );
  }

  if (imageLoadError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{imageLoadError}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Main selected image */}
      <div className="w-full aspect-[4/3] md:aspect-[16/9] relative rounded-xl overflow-hidden bg-white shadow-product">
        <AnimatePresence mode="wait">
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={selectedImage}
              className="w-full h-full"
            >
              <img 
                src={selectedImage} 
                alt="Generated jewelry" 
                className="w-full h-full object-contain"
                onLoad={() => handleImageLoad(selectedImage)}
                onError={() => handleImageError('Failed to load main image')}
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors">
                  <Heart size={20} className="text-neutral-700" />
                </button>
                <button 
                  onClick={() => handleDownload(selectedImage)}
                  disabled={isDownloading}
                  className={cn(
                    "p-2 bg-white rounded-full shadow-md transition-colors",
                    isDownloading 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-neutral-50"
                  )}
                >
                  {isDownloading ? (
                    <Loader size={20} className="text-neutral-700 animate-spin" />
                  ) : (
                    <Download size={20} className="text-neutral-700" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <AnimatePresence>
          {galleryImages.map((image, index) => (
            <motion.button
              key={image}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all",
                selectedImage === image 
                  ? "border-silver-400 shadow-md scale-105 z-10" 
                  : "border-transparent hover:border-silver-300"
              )}
            >
              <div className={`w-full h-64 ${shimmerActive[index] ? 'shimmer' : ''}`}>
                <img 
                  src={image} 
                  alt={`Generated jewelry ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(image)}
                  onError={() => handleImageError(`Failed to load thumbnail ${index + 1}`)}
                />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;