import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
          </div>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/products" className="text-gray-500 hover:text-gray-700 text-sm">
              Products
            </Link>
            <Link to="/orders" className="text-gray-500 hover:text-gray-700 text-sm">
              Orders
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;