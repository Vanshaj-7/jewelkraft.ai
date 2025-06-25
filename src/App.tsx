import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import EarringsPage from './pages/EarringsPage';
import BraceletsPage from './pages/BraceletsPage';
import RingsPage from './pages/RingsPage';
import NecklacesPage from './pages/NecklacesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/earrings" element={<EarringsPage />} />
          <Route path="/bracelets" element={<BraceletsPage />} />
          <Route path="/rings" element={<RingsPage />} />
          <Route path="/necklaces" element={<NecklacesPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;