import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api/cart';
import { useCartStore } from '../store/useCartStore';
import type { Cart as CartType } from '../types';

export default function Cart() {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCount } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(setCart).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (productId: number, quantity: number) => {
    const updated = await updateCartItem(productId, quantity);
    setCart(updated);
    setCount(updated.items.reduce((s, i) => s + i.quantity, 0));
  };

  const handleRemove = async (productId: number) => {
    const updated = await removeCartItem(productId);
    setCart(updated);
    setCount(updated.items.reduce((s, i) => s + i.quantity, 0));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 flex gap-4 animate-pulse">
            <div className="w-20 h-20 bg-neutral-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-neutral-200 rounded-full w-1/4" />
              <div className="h-4 bg-neutral-200 rounded-full w-1/2" />
              <div className="h-3 bg-neutral-200 rounded-full w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 text-sm mb-6">Add some fragrances to get started</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-violet-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-violet-800 transition-colors text-sm"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold text-neutral-900">Shopping Cart</h1>
        <span className="text-sm text-neutral-400">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
        {cart.items.map((item, i) => (
          <div
            key={item.productId}
            className={`flex gap-4 p-5 ${i > 0 ? 'border-t border-neutral-100' : ''}`}
          >
            <Link to={`/products/${item.productId}`} className="shrink-0">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-xl bg-neutral-100 hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200';
                }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">{item.brand}</p>
              <Link to={`/products/${item.productId}`} className="font-semibold text-neutral-900 hover:text-violet-900 transition-colors block truncate">
                {item.productName}
              </Link>
              <p className="text-xs text-neutral-400 mt-0.5">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex flex-col items-end justify-between shrink-0">
              <p className="font-bold text-violet-900">${item.subtotal.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-neutral-900 border-x border-neutral-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Shipping</span>
            <span className="text-emerald-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 text-lg pt-3 border-t border-neutral-100">
            <span>Total</span>
            <span className="text-violet-900">${cart.total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3.5 bg-violet-900 text-white rounded-xl font-semibold hover:bg-violet-800 transition-colors text-sm"
        >
          Proceed to Checkout
        </button>
        <Link
          to="/"
          className="block text-center text-sm text-neutral-500 hover:text-violet-900 mt-3 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
