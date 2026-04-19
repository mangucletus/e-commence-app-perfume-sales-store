import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const categoryStyle =
    product.category === 'MEN'
      ? 'bg-blue-50 text-blue-700'
      : product.category === 'WOMEN'
        ? 'bg-rose-50 text-rose-700'
        : 'bg-violet-50 text-violet-700';

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
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
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-black/60 px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase ${categoryStyle}`}>
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em] mb-0.5">
          {product.brand}
        </p>
        <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-50">
          <span className="text-base font-bold text-violet-900">${product.price.toFixed(2)}</span>
          <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">
            {product.size}
          </span>
        </div>
      </div>
    </Link>
  );
}
