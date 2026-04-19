import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../api/cart';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import type { Product } from '../types';

interface Props {
  product: Product;
}

const categoryStyle: Record<string, string> = {
  MEN: 'bg-blue-100 text-blue-700',
  WOMEN: 'bg-rose-100 text-rose-700',
  UNISEX: 'bg-violet-100 text-violet-700',
};

export default function ProductCard({ product }: Props) {
  const { token } = useAuthStore();
  const { setCount, count } = useCartStore();
  const { show } = useToastStore();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }
    if (product.stockQuantity === 0 || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setCount(count + 1);
      show(`${product.name} added to cart`);
    } catch {
      show('Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const inStock = product.stockQuantity > 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-neutral-100 hover:border-neutral-200">
      {/* Image + info — clickable area */}
      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400';
            }}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-black/60 px-3 py-1.5 rounded-full">
                Sold Out
              </span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase ${categoryStyle[product.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {product.category}
            </span>
          </div>
        </div>

        <div className="px-4 pt-3.5 pb-2">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em] mb-0.5">
            {product.brand}
          </p>
          <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-violet-900">${product.price.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {product.size}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart button — outside the Link to avoid nested interactivity */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || adding}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            !inStock
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : adding
                ? 'bg-violet-200 text-violet-700 cursor-wait'
                : token
                  ? 'bg-violet-900 text-white hover:bg-violet-800 active:scale-[0.98] shadow-sm shadow-violet-900/20'
                  : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
          }`}
        >
          {!inStock
            ? 'Out of Stock'
            : adding
              ? 'Adding…'
              : token
                ? 'Add to Cart'
                : 'Sign in to Buy'}
        </button>
      </div>
    </div>
  );
}
