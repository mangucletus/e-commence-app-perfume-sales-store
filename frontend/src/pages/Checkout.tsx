import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import { useCartStore } from '../store/useCartStore';
import type { Cart } from '../types';

export default function Checkout() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const { reset } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setPlacing(true);
    setError('');
    try {
      const order = await checkout(address);
      reset();
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-5 bg-neutral-200 rounded-full w-1/3 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded-full" />
              <div className="h-4 bg-neutral-200 rounded-full w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-7">Checkout</h1>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Order Summary</h2>
          <div className="space-y-0">
            {cart.items.map((item, i) => (
              <div
                key={item.productId}
                className={`flex justify-between items-center py-2.5 text-sm ${i < cart.items.length - 1 ? 'border-b border-neutral-50' : ''}`}
              >
                <span className="text-neutral-600">
                  {item.productName}
                  <span className="text-neutral-400 ml-1">×{item.quantity}</span>
                </span>
                <span className="font-semibold text-neutral-900">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-bold text-base mt-4 pt-4 border-t border-neutral-100">
            <span className="text-neutral-900">Total</span>
            <span className="text-violet-900 text-lg">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">Shipping Information</h2>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Shipping Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="123 Main St, City, Country"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
              </svg>
              Demo Mode
            </p>
            <p className="text-xs text-amber-600">No real payment is processed. Your order will be confirmed immediately.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={placing}
            className="w-full py-3.5 bg-violet-900 text-white rounded-xl font-semibold hover:bg-violet-800 disabled:opacity-50 transition-colors text-sm"
          >
            {placing ? 'Placing Order...' : `Place Order — $${cart.total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
