import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';
import type { Product } from '../types';
import { useAuthStore } from '../store/useAuthStore';

const categoryColors: Record<string, string> = {
  MEN: 'bg-blue-100 text-blue-700',
  WOMEN: 'bg-pink-100 text-pink-700',
  UNISEX: 'bg-purple-100 text-purple-700',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">{error || 'Not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-purple-700 mb-6 flex items-center gap-1">
        ← Back
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400';
              }}
            />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{product.brand}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[product.category]}`}>
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-500">Size: <strong>{product.size}</strong></span>
                <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>
              <p className="text-4xl font-bold text-purple-700 mb-8">${product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">Qty:</label>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 font-medium text-gray-900 border-x border-gray-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.stockQuantity === 0}
                className="w-full py-3 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? 'Adding...' : success ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
