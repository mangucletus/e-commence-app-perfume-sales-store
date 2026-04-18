import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import type { Order } from '../types';

const statusColors: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No orders yet</p>
        <Link to="/" className="text-purple-700 font-medium hover:underline">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-lg font-bold text-purple-700 mt-1">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1">
              {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
