import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category.name}</p>
          )}
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(product.price)}</p>
            {product.compare_at_price && (
              <p className="text-sm text-gray-500 line-through">{formatCurrency(product.compare_at_price)}</p>
            )}
          </div>
          {product.stock_quantity <= 0 && (
            <p className="mt-1 text-xs text-red-600 font-medium">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;