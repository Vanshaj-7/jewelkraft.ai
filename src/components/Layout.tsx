import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { cn } from '../utils/classNames';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 gradient-luxury-silver shadow-soft sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            <span className="bg-gradient-to-r from-platinum via-lavender-300 to-blue-200 bg-clip-text text-transparent">SilverCraft</span>
            <span className="text-charcoal"> AI</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/product">Products</NavLink>
            <NavLink href="/#about">About</NavLink>
            <NavLink href="/#contact">Contact</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <ShoppingBag size={20} />
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-50 md:hidden transition-all duration-300 flex flex-col",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            <span className="bg-gradient-to-r from-platinum via-lavender-300 to-blue-200 bg-clip-text text-transparent">SilverCraft</span>
            <span className="text-charcoal"> AI</span>
          </Link>
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={toggleMobileMenu}
          >
            <X size={24} />
          </button>
        </div>
        <div className="container flex-1 flex flex-col space-y-6 py-12">
          <MobileNavLink href="/" onClick={toggleMobileMenu}>Home</MobileNavLink>
          <MobileNavLink href="/product" onClick={toggleMobileMenu}>Products</MobileNavLink>
          <MobileNavLink href="/#about" onClick={toggleMobileMenu}>About</MobileNavLink>
          <MobileNavLink href="/#contact" onClick={toggleMobileMenu}>Contact</MobileNavLink>
        </div>
      </div>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="gradient-luxury-silver text-charcoal py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">SilverCraft AI</h3>
              <p className="text-neutral-400 max-w-xs">
                Revolutionizing jewelry design with AI technology.
                Create custom pieces with a simple prompt.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/" className="hover:text-lavender-300 transition-colors">Home</Link></li>
                <li><Link to="/product" className="hover:text-lavender-300 transition-colors">Products</Link></li>
                <li><Link to="/#about" className="hover:text-lavender-300 transition-colors">About Us</Link></li>
                <li><Link to="/#contact" className="hover:text-lavender-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium mb-4">Contact</h3>
              <address className="text-neutral-400 not-italic">
                1234 Jewelry Lane<br />
                San Francisco, CA 94103<br />
                contact@luxcraftai.com<br />
                +1 (555) 123-4567
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} SilverCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
      className="text-neutral-700 hover:text-silver-400 transition-colors font-medium"
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