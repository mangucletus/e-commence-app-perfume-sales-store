import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../types';

const categoryStyle: Record<string, string> = {
  MEN: 'bg-blue-50 text-blue-700',
  WOMEN: 'bg-rose-50 text-rose-700',
  UNISEX: 'bg-violet-50 text-violet-700',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { fetchCount } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product!.id, quantity);
      await fetchCount();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden animate-pulse">
          <div className="grid md:grid-cols-2">
            <div className="aspect-square bg-neutral-200" />
            <div className="p-8 space-y-4">
              <div className="h-3 bg-neutral-200 rounded-full w-1/3" />
              <div className="h-7 bg-neutral-200 rounded-full w-2/3" />
              <div className="h-4 bg-neutral-200 rounded-full w-full" />
              <div className="h-4 bg-neutral-200 rounded-full w-5/6" />
              <div className="h-8 bg-neutral-200 rounded-full w-1/4 mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-4">{error || 'Product not found'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-violet-900 font-semibold hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-violet-900 mb-6 transition-colors font-medium group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-neutral-100 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600';
              }}
            />
          </div>

          <div className="p-8 lg:p-10 flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.15em]">
                {product.brand}
              </p>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${categoryStyle[product.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-black text-neutral-900 leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-neutral-500 leading-relaxed text-sm mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-5 mb-6 pb-6 border-b border-neutral-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400 font-medium">Size</span>
                <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                  {product.size}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
                {inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </div>
            </div>

            <p className="text-4xl font-black text-violet-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-neutral-600">Quantity</label>
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-neutral-900 border-x border-neutral-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || !inStock}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  success
                    ? 'bg-emerald-500 text-white'
                    : 'bg-violet-900 text-white hover:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {adding
                  ? 'Adding to cart...'
                  : success
                    ? '✓ Added to Cart'
                    : inStock
                      ? 'Add to Cart'
                      : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
