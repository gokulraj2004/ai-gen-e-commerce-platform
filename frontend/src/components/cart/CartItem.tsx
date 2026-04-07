import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {item.product.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{formatCurrency(item.product.price)}</p>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="h-6 w-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-6 w-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            disabled={item.quantity >= item.product.stock_quantity}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-sm font-medium text-gray-900">{formatCurrency(item.line_total)}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;