import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api/cart';
import type { Cart as CartType } from '../types';

export default function Cart() {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(setCart).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (productId: number, quantity: number) => {
    const updated = await updateCartItem(productId, quantity);
    setCart(updated);
  };

  const handleRemove = async (productId: number) => {
    const updated = await removeCartItem(productId);
    setCart(updated);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-4">🛒</p>
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/" className="text-purple-700 font-medium hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {cart.items.map((item, i) => (
          <div key={item.productId} className={`flex gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded-xl bg-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400';
              }}
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{item.brand}</p>
              <p className="font-semibold text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <p className="font-bold text-purple-700">${item.subtotal.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">${cart.total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
