import React, { useState } from 'react';
import { validateProduct, ValidationError } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';
import { storageService } from '../services/storage';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ProductFormProps {
  designId: string;
  onSave: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ designId, onSave }) => {
  const { showToast } = useToast();
  const [error, setError] = useState<ValidationError | null>(null);
  const [formData, setFormData] = useState({
    material: '',
    size: '',
    color: '',
    hallmark: '',
    purity: '',
    weight: '',
    quantity: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateProduct(formData);
    if (validationError) {
      setError(validationError);
      showToast(validationError.message, 'error');
      return;
    }

    const product: Product = {
      id: crypto.randomUUID(),
      designId,
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    storageService.saveProduct(product);
    onSave(product);
    showToast('Product configuration saved!', 'success');
  };

  const handleAddToCart = () => {
    const validationError = validateProduct(formData);
    if (validationError) {
      setError(validationError);
      showToast(validationError.message, 'error');
      return;
    }

    const product: Product = {
      id: crypto.randomUUID(),
      designId,
      ...formData,
      status: 'cart',
      createdAt: new Date().toISOString()
    };

    storageService.saveProduct(product);
    storageService.addToCart(product.id, formData.quantity);
    showToast('Added to cart!', 'success');
  };

  return (
    <motion.form
      className="bg-white rounded-lg shadow-soft p-6 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
    >
      {/* Material Selection */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Material
        </label>
        <div className="flex flex-wrap gap-2">
          {['Sterling Silver', 'Platinum'].map((material) => (
            <button
              key={material}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, material }))}
              className={`
                px-4 py-2 border rounded-full text-sm transition-colors font-medium
                ${formData.material === material
                  ? 'border-lavender-300 bg-lavender-100 text-charcoal shadow'
                  : 'border-platinum hover:border-lavender-200'
                }
              `}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, size }))}
              className={`
                px-4 py-2 border rounded-full text-sm transition-colors font-medium
                ${formData.size === size
                  ? 'border-lavender-300 bg-lavender-100 text-charcoal shadow'
                  : 'border-platinum hover:border-lavender-200'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Finish
        </label>
        <div className="flex flex-wrap gap-2">
          {['Polished', 'Matte', 'Oxidized'].map((finish) => (
            <button
              key={finish}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color: finish }))}
              className={`
                px-4 py-2 border rounded-full text-sm transition-colors font-medium
                ${formData.color === finish
                  ? 'border-lavender-300 bg-lavender-100 text-charcoal shadow'
                  : 'border-platinum hover:border-lavender-200'
                }
              `}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-charcoal">Advanced Details</h3>
        {/* Hallmarking */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Hallmarking
          </label>
          <select
            value={formData.hallmark}
            onChange={(e) => setFormData(prev => ({ ...prev, hallmark: e.target.value }))}
            className="w-full border border-platinum rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent"
          >
            <option value="">Select hallmarking</option>
            {['925', '950', 'Platinum'].map((hallmark) => (
              <option key={hallmark} value={hallmark}>
                {hallmark}
              </option>
            ))}
          </select>
        </div>
        {/* Purity */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Purity
          </label>
          <select
            value={formData.purity}
            onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
            className="w-full border border-platinum rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent"
          >
            <option value="">Select purity</option>
            {['99.9%', '99.5%', '92.5% (Sterling Silver)'].map((purity) => (
              <option key={purity} value={purity}>
                {purity}
              </option>
            ))}
          </select>
        </div>
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Weight Range
          </label>
          <select
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            className="w-full border border-platinum rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent"
          >
            <option value="">Select weight range</option>
            {['1-5g', '5-10g', '10-20g', '20-50g'].map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                quantity: Math.max(1, prev.quantity - 1) 
              }))}
              className="p-2 border border-platinum rounded-lg hover:bg-lavender-100"
            >
              -
            </button>
            <span className="w-8 text-center">{formData.quantity}</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                quantity: prev.quantity + 1 
              }))}
              className="p-2 border border-platinum rounded-lg hover:bg-lavender-100"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-400">
          {error.message}
        </p>
      )}
      <div className="flex gap-4 mt-8">
        <motion.button
          type="submit"
          className="flex-1 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          aria-label="Buy Now"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          Buy Now
        </motion.button>
        <motion.button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl border-2 border-yellow-400 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ProductForm; 