import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to E-Commerce Platform
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Browse items, manage your collection, and more.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/items"
            className="bg-primary-600 text-white px-6 py-3 rounded-md text-lg hover:bg-primary-700"
          >
            Browse Items
          </Link>
          <Link
            to="/register"
            className="border border-primary-600 text-primary-600 px-6 py-3 rounded-md text-lg hover:bg-primary-50"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;