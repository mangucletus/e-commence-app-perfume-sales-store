import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import type { Order } from '../types';

const statusConfig: Record<Order['status'], { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border border-amber-100' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  SHIPPED: { label: 'Shipped', className: 'bg-blue-50 text-blue-700 border border-blue-100' },
  DELIVERED: { label: 'Delivered', className: 'bg-violet-50 text-violet-700 border border-violet-100' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-100' },
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-5 bg-neutral-200 rounded-full w-1/3 mb-4" />
            <div className="space-y-2.5">
              <div className="h-4 bg-neutral-200 rounded-full" />
              <div className="h-4 bg-neutral-200 rounded-full w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-4">Order not found</p>
        <Link to="/orders" className="text-sm text-violet-900 font-semibold hover:underline">
          View all orders
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];

  return (
    <div className="max-w-2xl mx-auto">
      {justPlaced && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-emerald-800 font-bold mb-1">Order placed successfully!</p>
          <p className="text-emerald-600 text-sm">Thank you for your purchase. We'll process it shortly.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order #{order.id}</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-4">Items</h2>
          <div className="space-y-0">
            {order.items.map((item, i) => (
              <div
                key={item.productId}
                className={`flex justify-between items-start py-3 ${i < order.items.length - 1 ? 'border-b border-neutral-50' : ''}`}
              >
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{item.productName}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {item.brand} · Qty: {item.quantity} · ${item.priceAtPurchase.toFixed(2)} each
                  </p>
                </div>
                <span className="font-bold text-neutral-900 text-sm ml-4">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-bold text-base mt-4 pt-4 border-t border-neutral-100">
            <span className="text-neutral-900">Total</span>
            <span className="text-violet-900 text-lg">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-3">Shipping Address</h2>
          <p className="text-neutral-600 text-sm leading-relaxed">{order.shippingAddress}</p>
        </div>
      </div>

      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-violet-900 font-semibold hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        All Orders
      </Link>
    </div>
  );
}
