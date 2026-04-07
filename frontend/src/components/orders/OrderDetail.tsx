import React from 'react';
import type { Order } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

interface OrderDetailProps {
  order: Order;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderDetailComponent: React.FC<OrderDetailProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h2>
          <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Items</h3>
        </div>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {item.product_image_url ? (
                  <img src={item.product_image_url} alt={item.product_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
              </div>
              <p className="font-medium text-gray-900">{formatCurrency(item.line_total)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
          <p className="text-gray-600">
            {order.shipping_address.street}<br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}<br />
            {order.shipping_address.country}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailComponent;