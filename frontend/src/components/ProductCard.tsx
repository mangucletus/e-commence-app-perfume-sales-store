import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

const categoryColors = {
  MEN: 'bg-blue-100 text-blue-700',
  WOMEN: 'bg-pink-100 text-pink-700',
  UNISEX: 'bg-purple-100 text-purple-700',
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-semibold text-gray-900 leading-tight">{product.name}</h3>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${categoryColors[product.category]}`}>
            {product.category}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-purple-700">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400">{product.size}</span>
        </div>
        {product.stockQuantity === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
