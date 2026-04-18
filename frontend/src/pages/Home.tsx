import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const categories = ['ALL', 'MEN', 'WOMEN', 'UNISEX'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getProducts(category === 'ALL' ? undefined : category)
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Your Scent</h1>
        <p className="text-gray-500 text-lg">Premium fragrances for every occasion</p>
      </div>

      <div className="flex gap-2 mb-8 justify-center flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c
                ? 'bg-purple-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 py-16">No products found in this category.</p>
      )}
    </div>
  );
}
