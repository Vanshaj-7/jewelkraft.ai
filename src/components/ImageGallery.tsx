import React, { useState } from 'react';
import { cn } from '../utils/classNames';
import { motion } from 'framer-motion';
import { Download, Heart, Loader } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  isLoading: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images.length > 0 ? images[0] : null
  );
  
  // Update selected image when new images arrive
  React.useEffect(() => {
    if (images.length > 0 && !isLoading) {
      setSelectedImage(images[0]);
    }
  }, [images, isLoading]);

  if (isLoading) {
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

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No images generated yet. Enter a prompt to create jewelry designs.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Main selected image */}
      <div className="w-full aspect-[4/3] md:aspect-[16/9] relative rounded-xl overflow-hidden bg-white shadow-product">
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={selectedImage}
            className="w-full h-full"
          >
            <img 
              src={selectedImage} 
              alt="Generated jewelry" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors">
                <Heart size={20} className="text-neutral-700" />
              </button>
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors">
                <Download size={20} className="text-neutral-700" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "aspect-square rounded-md overflow-hidden border-2 transition-all",
              selectedImage === image 
                ? "border-gold-500 shadow-md scale-105 z-10" 
                : "border-transparent hover:border-gold-300"
            )}
          >
            <img 
              src={image} 
              alt={`Generated jewelry ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;