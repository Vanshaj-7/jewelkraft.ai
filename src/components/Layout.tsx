import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ShoppingCart } from 'lucide-react';
import { cn } from '../utils/classNames';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const updateCartCount = () => {
      const cart = storageService.getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };
    
    updateCartCount();
    // Update cart count when storage changes (you might want to add a storage event listener)
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        className="py-4 gradient-luxury-silver shadow-soft sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start text-2xl font-serif font-bold tracking-tight shimmer" aria-label="Home">
            <span className="bg-gradient-to-r from-platinum via-lavender-300 to-blue-200 bg-clip-text text-transparent text-3xl md:text-4xl leading-tight">Gehnaz</span>
            <span className="text-charcoal text-xs md:text-base font-normal tracking-wide mt-1 mb-1" style={{letterSpacing: '0.1em'}}>Your Silver Abode</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/earrings">Earrings</NavLink>
            <NavLink href="/bracelets">Bracelets</NavLink>
            <NavLink href="/rings">Rings</NavLink>
            <NavLink href="/necklaces">Necklaces</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors" aria-label="Cart" onClick={handleCartClick}>
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <motion.div 
        className={cn(
          "fixed inset-0 bg-white z-50 md:hidden transition-all duration-300 flex flex-col",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight shimmer" aria-label="Home">
            <span className="bg-gradient-to-r from-platinum via-lavender-300 to-blue-200 bg-clip-text text-transparent">Gehnaz</span>
            <span className="text-charcoal"> Your Silver Abode</span>
          </Link>
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="container flex-1 flex flex-col space-y-6 py-12">
          <MobileNavLink href="/" onClick={toggleMobileMenu}>Home</MobileNavLink>
          <MobileNavLink href="/earrings" onClick={toggleMobileMenu}>Earrings</MobileNavLink>
          <MobileNavLink href="/bracelets" onClick={toggleMobileMenu}>Bracelets</MobileNavLink>
          <MobileNavLink href="/rings" onClick={toggleMobileMenu}>Rings</MobileNavLink>
          <MobileNavLink href="/necklaces" onClick={toggleMobileMenu}>Necklaces</MobileNavLink>
          <MobileNavLink href="/about" onClick={toggleMobileMenu}>About</MobileNavLink>
          <MobileNavLink href="/contact" onClick={toggleMobileMenu}>Contact</MobileNavLink>
        </div>
      </motion.div>
      
      <main className="flex-1">
        {children}
      </main>
      
      <motion.footer
        className="gradient-luxury-silver text-charcoal py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">Gehnaz</h3>
              <p className="text-neutral-400 max-w-xs">
                Your Silver Abode. Revolutionizing jewelry design with AI technology.
                Create custom pieces with a simple prompt.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/" className="hover:text-lavender-300 transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-lavender-300 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-lavender-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">Contact</h3>
              <address className="text-neutral-400 not-italic">
                1234 Jewelry Lane<br />
                San Francisco, CA 94103<br />
                contact@gehnaz.com<br />
                +1 (555) 123-4567
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} Gehnaz. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link 
      to={href} 
      className="text-neutral-700 hover:text-silver-400 transition-colors font-medium nav-underline"
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, children, onClick }) => {
  return (
    <Link 
      to={href} 
      className="text-2xl font-serif text-neutral-800 hover:text-silver-400 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Layout;