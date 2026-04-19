import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const categories = ['ALL', 'MEN', 'WOMEN', 'UNISEX'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    getProducts(category === 'ALL' ? undefined : category)
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [category, retryCount]);

  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden mb-12" style={{ background: 'linear-gradient(135deg, #2e1065 0%, #6b21a8 60%, #7c3aed 100%)' }}>
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=30')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 to-transparent" />
        <div className="relative px-8 sm:px-12 py-14 sm:py-20 lg:py-24 max-w-lg">
          <p className="text-amber-400 text-xs tracking-[0.35em] uppercase font-bold mb-4">New Collection</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-5">
            Discover Your<br />Signature Scent
          </h1>
          <p className="text-violet-200 text-sm sm:text-base leading-relaxed mb-8">
            Premium fragrances crafted for those who appreciate the art of luxury perfumery.
          </p>
          <Link
            to="/"
            onClick={() => setCategory('ALL')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm shadow-lg shadow-amber-500/30"
          >
            Shop Collection
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-sm text-neutral-400 font-medium mr-1">Filter by:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              category === c
                ? 'bg-violet-900 text-white shadow-sm shadow-violet-200'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-violet-300 hover:text-violet-900'
            }`}
          >
            {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-neutral-200" />
              <div className="p-4 space-y-2">
                <div className="h-2.5 bg-neutral-200 rounded-full w-1/2" />
                <div className="h-4 bg-neutral-200 rounded-full w-3/4" />
                <div className="h-2.5 bg-neutral-200 rounded-full w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-neutral-500 mb-4 text-sm">{error}</p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="text-sm text-violet-900 font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-sm">No products found in this category.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
