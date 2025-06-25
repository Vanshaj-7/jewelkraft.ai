import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Product, Design } from '../types';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; prompt: string; image: string; price: string }[]>([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = storageService.getCart();
    const products = storageService.getProducts();
    const designs = storageService.getDesigns();
    const items = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const design = designs.find(d => d.id === product.designId);
      return {
        product,
        quantity: item.quantity,
        prompt: design?.prompt || 'Custom Jewelry',
        image: design?.images?.[0] || '/dummy-images/ring1.jpg',
        price: '₹2,499', // TODO: Replace with real price logic
      };
    }).filter(Boolean) as { product: Product; quantity: number; prompt: string; image: string; price: string }[];
    setCartItems(items);
    setTotal(items.reduce((sum, i) => sum + (parseFloat(String(i.price.replace(/[^\d.]/g, ''))) * i.quantity), 0));
  }, []);

  const handleRemove = (id: string) => {
    storageService.removeFromCart(id);
    setCartItems(items => items.filter(i => i.product.id !== id));
  };

  const handleQuantity = (id: string, qty: number) => {
    storageService.updateCartItemQuantity(id, qty);
    setCartItems(items => items.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-serif font-semibold mb-10 text-center text-gray-900">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-lg text-gray-500">Your cart is empty.</div>
      ) : (
        <motion.div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item, idx) => (
              <motion.div
                key={item.product.id}
                className="flex items-center py-6 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <img src={item.image} alt={item.prompt} className="w-20 h-20 object-contain rounded-xl border bg-neutral-50" />
                <div className="flex-1">
                  <div className="font-serif text-lg font-medium text-gray-900">{item.prompt}</div>
                  <div className="text-primary-600 font-semibold">{item.price}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <label htmlFor={`qty-${item.product.id}`} className="text-sm text-gray-600">Qty:</label>
                    <input
                      id={`qty-${item.product.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleQuantity(item.product.id, Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2 py-1 border rounded-lg text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-gray-900">₹{(parseFloat(String(item.price.replace(/[^\d.]/g, ''))) * item.quantity).toLocaleString()}</div>
                  <button aria-label="Remove from cart" onClick={() => handleRemove(item.product.id)} className="p-2 rounded-full hover:bg-red-50 transition-colors">
                    <X className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-8">
            <div className="text-xl font-serif font-semibold">Total:</div>
            <div className="text-2xl font-bold text-primary-700">₹{total.toLocaleString()}</div>
          </div>
          <button
            className="w-full mt-8 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage; 