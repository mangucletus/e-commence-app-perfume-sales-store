import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import type { Cart } from '../types';

export default function Checkout() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
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
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{item.productName} × {item.quantity}</span>
              <span className="font-medium">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-purple-700">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Shipping Information</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Shipping Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="123 Main St, City, Country"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Payment (Simulated)</p>
            <p>No real payment is processed. Your order will be confirmed immediately.</p>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full py-3 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {placing ? 'Placing Order...' : `Place Order — $${cart.total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
