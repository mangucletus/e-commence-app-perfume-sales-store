import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getBrands } from '../api/products';
import type { Product, PagedResponse } from '../types';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['ALL', 'MEN', 'WOMEN', 'UNISEX'];
const SORT_OPTIONS = [
  { value: 'id:asc', label: 'Newest' },
  { value: 'price:asc', label: 'Price: Low → High' },
  { value: 'price:desc', label: 'Price: High → Low' },
  { value: 'name:asc', label: 'Name A–Z' },
  { value: 'brand:asc', label: 'Brand A–Z' },
];
const PAGE_SIZE = 12;

export default function Home() {
  const [paged, setPaged] = useState<PagedResponse<Product> | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('ALL');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('id:asc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  useEffect(() => { setPage(0); }, [category, brand, sort, minPrice, maxPrice]);

  useEffect(() => {
    getBrands().then(setBrands).catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    const [sortBy, sortDir] = sort.split(':') as [string, 'asc' | 'desc'];
    getProducts({
      category: category !== 'ALL' ? category : undefined,
      brand: brand || undefined,
      search: debouncedSearch || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page,
      size: PAGE_SIZE,
      sortBy,
      sortDir,
    })
      .then(setPaged)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [category, brand, sort, debouncedSearch, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setCategory('ALL');
    setBrand('');
    setSort('id:asc');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setPage(0);
  };

  const hasActiveFilters = category !== 'ALL' || brand || debouncedSearch || minPrice || maxPrice || sort !== 'id:asc';

  return (
    <div>
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #6b21a8 60%, #7c3aed 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.18] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=30')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 via-violet-900/40 to-transparent" />
        <div className="relative px-8 sm:px-14 py-16 sm:py-22 lg:py-28 max-w-2xl">
          <p className="text-amber-400 text-xs tracking-[0.35em] uppercase font-bold mb-4">New Collection 2025</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5">
            Discover Your<br />Signature Scent
          </h1>
          <p className="text-violet-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Over 40 premium fragrances crafted for those who appreciate the art of luxury perfumery.
          </p>
          <Link
            to="/"
            onClick={() => { setCategory('ALL'); setPage(0); }}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm shadow-lg shadow-amber-500/30"
          >
            Shop All Fragrances
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Search + Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 sm:p-5 mb-8 space-y-4">

        {/* Row 1: search + sort + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or notes…"
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-neutral-50 focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort + Filter toggle side-by-side on mobile */}
          <div className="flex gap-2 sm:contents">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 sm:flex-none border border-neutral-200 rounded-xl px-3 sm:px-4 py-2.5 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition text-neutral-700 sm:min-w-[170px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`sm:hidden flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition shrink-0 ${filtersOpen ? 'bg-violet-900 text-white border-violet-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-violet-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
              </svg>
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-400 font-semibold">Category:</span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(0); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === c
                  ? 'bg-violet-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-violet-100 hover:text-violet-900'
              }`}
            >
              {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Extended filters (brand, price, clear) */}
        <div className={`${filtersOpen ? 'flex' : 'hidden sm:flex'} flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap pt-1 border-t border-neutral-100`}>
          {brands.length > 0 && (
            <select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setPage(0); }}
              className="border border-neutral-200 rounded-xl px-4 py-2 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition text-neutral-700"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold whitespace-nowrap">Price:</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
              placeholder="Min $"
              min={0}
              className="w-24 border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            />
            <span className="text-neutral-400 text-xs font-medium">–</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
              placeholder="Max $"
              min={0}
              className="w-24 border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Results summary */}
        {!loading && paged && paged.totalElements > 0 && (
          <p className="text-xs text-neutral-400 pt-1 border-t border-neutral-50">
            Showing {paged.number * PAGE_SIZE + 1}–{Math.min((paged.number + 1) * PAGE_SIZE, paged.totalElements)} of {paged.totalElements} products
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
              <div className="aspect-[3/4] bg-neutral-200" />
              <div className="p-4 space-y-2.5">
                <div className="h-2.5 bg-neutral-200 rounded-full w-1/2" />
                <div className="h-4 bg-neutral-200 rounded-full w-3/4" />
                <div className="h-9 bg-neutral-200 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-neutral-500 mb-4 text-sm">{error}</p>
          <button onClick={fetchProducts} className="text-sm text-violet-900 font-semibold hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && paged?.totalElements === 0 && (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-neutral-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <p className="text-neutral-700 font-semibold mb-1">No products found</p>
          <p className="text-neutral-400 text-sm mb-5">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-sm text-violet-900 font-semibold hover:underline">
            Clear all filters
          </button>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && paged && paged.totalElements > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paged.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {paged.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={paged.first}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-neutral-200 rounded-xl bg-white text-neutral-700 hover:bg-neutral-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Prev
              </button>

              {Array.from({ length: paged.totalPages }).map((_, i) => {
                const show = i === 0 || i === paged.totalPages - 1 || Math.abs(i - paged.number) <= 1;
                const isGap = !show && (i === 1 || i === paged.totalPages - 2);
                if (isGap) return <span key={i} className="text-neutral-400 text-sm px-1">…</span>;
                if (!show) return null;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 text-sm font-semibold rounded-xl transition ${
                      paged.number === i
                        ? 'bg-violet-900 text-white shadow-sm'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-violet-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={paged.last}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-neutral-200 rounded-xl bg-white text-neutral-700 hover:bg-neutral-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
