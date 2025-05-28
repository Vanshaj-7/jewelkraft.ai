import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ShoppingCart, Heart, Share2, Info } from 'lucide-react';
import { cn } from '../utils/classNames';

interface ProductDetails {
  materials: string[];
  sizes: string[];
  karats: number[];
  colors: string[];
  hallmarking: string[];
  purity: string[];
  weight_ranges: string[];
}

const ProductPage: React.FC = () => {
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product configuration state
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedKarat, setSelectedKarat] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedHallmark, setSelectedHallmark] = useState<string>('');
  const [selectedPurity, setSelectedPurity] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product_details');
        setDetails(response.data);
        
        // Set default selections
        if (response.data.materials?.length) setSelectedMaterial(response.data.materials[0]);
        if (response.data.sizes?.length) setSelectedSize(response.data.sizes[0]);
        if (response.data.karats?.length) setSelectedKarat(response.data.karats[0]);
        if (response.data.colors?.length) setSelectedColor(response.data.colors[0]);
        if (response.data.hallmarking?.length) setSelectedHallmark(response.data.hallmarking[0]);
        if (response.data.purity?.length) setSelectedPurity(response.data.purity[0]);
        if (response.data.weight_ranges?.length) setSelectedWeight(response.data.weight_ranges[0]);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, []);
  
  // Sample image for product display
  const productImage = "https://images.pexels.com/photos/10984851/pexels-photo-10984851.jpeg";
  
  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-50 rounded-lg overflow-hidden">
              <img 
                src={productImage} 
                alt="Gold diamond ring" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[productImage, productImage, productImage, productImage].map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square bg-neutral-50 rounded-md overflow-hidden border border-neutral-200"
                >
                  <img 
                    src={img} 
                    alt={`Product view ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif mb-2">Elegance Diamond Ring</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-neutral-600">32 reviews</span>
              </div>
              <div className="text-2xl font-medium">$1,299.00</div>
            </div>
            
            <div className="space-y-6">
              {/* Material Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Material
                </label>
                <div className="flex flex-wrap gap-2">
                  {details?.materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={cn(
                        "px-4 py-2 border rounded-full text-sm transition-colors",
                        selectedMaterial === material
                          ? "border-gold-500 bg-gold-50 text-gold-800"
                          : "border-neutral-200 hover:border-gold-300"
                      )}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {details?.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 border rounded-full text-sm transition-colors",
                        selectedSize === size
                          ? "border-gold-500 bg-gold-50 text-gold-800"
                          : "border-neutral-200 hover:border-gold-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Karat Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Karat
                </label>
                <div className="flex flex-wrap gap-2">
                  {details?.karats.map((karat) => (
                    <button
                      key={karat}
                      onClick={() => setSelectedKarat(karat)}
                      className={cn(
                        "px-4 py-2 border rounded-full text-sm transition-colors",
                        selectedKarat === karat
                          ? "border-gold-500 bg-gold-50 text-gold-800"
                          : "border-neutral-200 hover:border-gold-300"
                      )}
                    >
                      {karat}K
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {details?.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 border rounded-full text-sm transition-colors",
                        selectedColor === color
                          ? "border-gold-500 bg-gold-50 text-gold-800"
                          : "border-neutral-200 hover:border-gold-300"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Advanced Details Accordion */}
              <Accordion 
                title="Advanced Details"
                content={
                  <div className="space-y-4 pt-2">
                    {/* Hallmarking */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Hallmarking
                      </label>
                      <select
                        value={selectedHallmark}
                        onChange={(e) => setSelectedHallmark(e.target.value)}
                        className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      >
                        {details?.hallmarking.map((mark) => (
                          <option key={mark} value={mark}>
                            {mark}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Purity */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Purity
                      </label>
                      <select
                        value={selectedPurity}
                        onChange={(e) => setSelectedPurity(e.target.value)}
                        className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      >
                        {details?.purity.map((purity) => (
                          <option key={purity} value={purity}>
                            {purity}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Weight Range */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Weight Range
                      </label>
                      <select
                        value={selectedWeight}
                        onChange={(e) => setSelectedWeight(e.target.value)}
                        className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      >
                        {details?.weight_ranges.map((weight) => (
                          <option key={weight} value={weight}>
                            {weight}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                }
              />
              
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border border-neutral-300 rounded-l-md hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-y border-neutral-300 py-1 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 border border-neutral-300 rounded-r-md hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex-1 bg-gold-600 hover:bg-gold-500 text-white py-3 px-6 rounded-full flex items-center justify-center space-x-2 shadow-md transition-colors">
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 border border-neutral-300 hover:border-gold-300 py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition-colors">
                  <Heart size={18} />
                  <span>Save</span>
                </button>
                <button className="flex-1 border border-neutral-300 hover:border-gold-300 py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition-colors">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            {/* Product Description */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-lg font-serif mb-3">Product Description</h3>
              <p className="text-neutral-600 leading-relaxed">
                This exquisite ring features a brilliant center diamond surrounded by a halo of smaller diamonds, 
                all set in your choice of precious metal. The delicate band is adorned with pavé diamonds for added sparkle. 
                Perfect for engagements, anniversaries, or as a luxurious gift for yourself.
              </p>
            </div>
            
            {/* Shipping Info */}
            <div className="bg-neutral-50 p-4 rounded-lg flex items-start space-x-3">
              <Info size={20} className="text-neutral-600 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Shipping & Returns</h4>
                <p className="text-sm text-neutral-600">
                  Free shipping on orders over $100. Returns accepted within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-neutral-200 pt-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ProductPage;