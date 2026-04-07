import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import CartIcon from '../cart/CartIcon';
import ProductSearch from '../products/ProductSearch';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = useCallback((query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  }, [navigate]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              ShopHub
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                Products
              </Link>
            </nav>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <ProductSearch onSearch={handleSearch} />
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && <CartIcon itemCount={cart?.item_count ?? 0} />}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {user?.first_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="mb-3">
              <ProductSearch onSearch={(q) => { handleSearch(q); setMobileMenuOpen(false); }} />
            </div>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;