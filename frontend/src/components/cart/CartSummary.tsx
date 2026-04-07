import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartSummaryProps {
  subtotal: string;
  itemCount: number;
  shippingCost?: string;
  total?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, itemCount, shippingCost, total }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({itemCount} items)</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {shippingCost !== undefined && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
      )}
      {total !== undefined && (
        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
};

export default CartSummary;