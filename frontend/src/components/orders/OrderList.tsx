import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface OrderListProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;