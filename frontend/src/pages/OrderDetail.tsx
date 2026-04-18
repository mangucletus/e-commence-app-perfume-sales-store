import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import type { Order } from '../types';

const statusColors: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const justPlaced = (location.state as any)?.justPlaced;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(Number(id)).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!order) return <div className="text-center py-20 text-red-500">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {justPlaced && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-700 font-semibold text-lg">Order placed successfully!</p>
          <p className="text-green-600 text-sm">Thank you for your purchase.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">{item.brand} · Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${item.subtotal.toFixed(2)}</p>
              <p className="text-xs text-gray-400">${item.priceAtPurchase.toFixed(2)} each</p>
            </div>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-purple-700">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
        <p className="text-gray-600">{order.shippingAddress}</p>
        <p className="text-sm text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <Link to="/orders" className="text-purple-700 font-medium hover:underline text-sm">
        ← All Orders
      </Link>
    </div>
  );
}
