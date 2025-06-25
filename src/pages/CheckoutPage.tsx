import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Product, Design } from '../types';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; prompt: string; image: string; price: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Razorpay integration (test mode)
    const options = {
      key: 'rzp_test_YourKeyHere', // Replace with your Razorpay test key
      amount: total * 100, // in paise
      currency: 'INR',
      name: 'Gehnaz',
      description: 'Jewelry Order',
      handler: async function (response: any) {
        try {
          // POST order to backend
          const res = await axios.post('/api/orders', {
            items: cartItems.map(i => ({ prompt: i.prompt, quantity: i.quantity, price: i.price })),
            shipping: form,
            payment_id: response.razorpay_payment_id,
            amount: total,
            email: form.email,
          });
          setSuccess(true);
          setOrderId(res.data.order_id);
          storageService.clearCart();
        } catch (err: any) {
          setError('Order could not be saved. Please contact support.');
        }
        setLoading(false);
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        address: form.address,
      },
      theme: {
        color: '#7c3aed',
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function () {
      setError('Payment failed. Please try again.');
      setLoading(false);
    });
    rzp.open();
  };

  if (success && orderId) {
    return (
      <div className="container py-16 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl shadow-soft p-10 max-w-lg text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-3xl font-serif font-bold text-primary-700 mb-4">Thank you for your order!</h1>
          <p className="text-lg text-gray-700 mb-4">Your payment was successful. Order ID: <span className="font-mono text-primary-700">{orderId}</span></p>
          <div className="mb-4 text-left">
            <div className="font-semibold mb-1">Order Summary:</div>
            <ul className="text-sm text-gray-700 mb-2">
              {cartItems.map((item, idx) => (
                <li key={idx}>{item.prompt} × {item.quantity} — {item.price}</li>
              ))}
            </ul>
            <div className="text-sm text-gray-700 mb-2">Shipping: {form.name}, {form.address}, {form.phone}, {form.email}</div>
            <div className="text-lg font-bold text-primary-700">Total Paid: ₹{total.toLocaleString()}</div>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            <button className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors" onClick={() => navigate('/cart')}>Back to Cart</button>
            <button className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-16 min-h-screen">
      <h1 className="text-4xl font-serif font-semibold mb-10 text-center text-gray-900">Checkout</h1>
      <motion.div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8">
        <h2 className="text-2xl font-serif font-semibold mb-6">Order Summary</h2>
        <div className="divide-y divide-gray-200 mb-8">
          {cartItems.map((item, idx) => (
            <div key={item.product.id} className="flex items-center py-4 gap-6">
              <img src={item.image} alt={item.prompt} className="w-16 h-16 object-contain rounded-xl border bg-neutral-50" />
              <div className="flex-1">
                <div className="font-serif text-lg font-medium text-gray-900">{item.prompt}</div>
                <div className="text-primary-600 font-semibold">{item.price}</div>
                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="text-lg font-bold text-gray-900">₹{(parseFloat(String(item.price.replace(/[^\d.]/g, ''))) * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-serif font-semibold">Total:</div>
          <div className="text-2xl font-bold text-primary-700">₹{total.toLocaleString()}</div>
        </div>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form className="space-y-6" onSubmit={handlePayment}>
          <h2 className="text-2xl font-serif font-semibold mb-2">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleInput} required placeholder="Full Name" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400" />
            <input name="phone" value={form.phone} onChange={handleInput} required placeholder="Phone Number" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400" />
            <input name="email" value={form.email} onChange={handleInput} required placeholder="Email Address" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400" />
            <textarea name="address" value={form.address} onChange={handleInput} required placeholder="Shipping Address" className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 shadow text-lg font-serif placeholder-gray-400 min-h-[80px] md:col-span-2" />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors" disabled={loading}>
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </form>
        {loading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-white text-lg">Processing payment...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutPage; 