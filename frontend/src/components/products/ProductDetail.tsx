import React from 'react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  isAddingToCart?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, isAddingToCart = false }) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        {product.category && (
          <p className="mt-2 text-sm text-gray-500 uppercase tracking-wide">{product.category.name}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <p className="text-3xl font-semibold text-gray-900">{formatCurrency(product.price)}</p>
          {product.compare_at_price && (
            <p className="text-xl text-gray-500 line-through">{formatCurrency(product.compare_at_price)}</p>
          )}
        </div>
        {product.sku && (
          <p className="mt-2 text-sm text-gray-400">SKU: {product.sku}</p>
        )}
        <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

        <div className="mt-6">
          {product.stock_quantity > 0 ? (
            <p className="text-sm text-green-600 font-medium">
              In Stock ({product.stock_quantity} available)
            </p>
          ) : (
            <p className="text-sm text-red-600 font-medium">Out of Stock</p>
          )}
        </div>

        {product.stock_quantity > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                -
              </button>
              <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                +
              </button>
            </div>
            <Button onClick={handleAddToCart} isLoading={isAddingToCart} size="lg">
              Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;