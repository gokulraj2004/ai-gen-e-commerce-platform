import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/products';
import type { Product } from '../types/product';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Layout from '../components/layout/Layout';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.list({ page: 1, page_size: 8, sort_by: 'created_at', sort_order: 'desc' });
        setFeaturedProducts(data.items);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to ShopHub</h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Discover amazing products at great prices
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-primary-50 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Products</h2>
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No products available yet.</p>
        )}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;