import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import type { Order } from '../types';

const statusConfig: Record<Order['status'], { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border border-amber-100' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  SHIPPED: { label: 'Shipped', className: 'bg-blue-50 text-blue-700 border border-blue-100' },
  DELIVERED: { label: 'Delivered', className: 'bg-violet-50 text-violet-700 border border-violet-100' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-100' },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded-full w-24" />
                <div className="h-3 bg-neutral-200 rounded-full w-20" />
              </div>
              <div className="h-6 bg-neutral-200 rounded-full w-20" />
            </div>
            <div className="h-3 bg-neutral-200 rounded-full w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2">No orders yet</h2>
        <p className="text-neutral-500 text-sm mb-6">Your order history will appear here</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-violet-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-violet-800 transition-colors text-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-7">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-neutral-900 group-hover:text-violet-900 transition-colors">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${status.className}`}>
                    {status.label}
                  </span>
                  <p className="text-base font-bold text-violet-900 mt-1.5">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-400 truncate">
                {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(' · ')}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
