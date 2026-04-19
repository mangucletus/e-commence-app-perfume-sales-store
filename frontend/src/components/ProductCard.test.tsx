import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../types';

vi.mock('../api/cart', () => ({ addToCart: vi.fn() }));
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({ token: null })),
}));
vi.mock('../store/useCartStore', () => ({
  useCartStore: vi.fn(() => ({ count: 0, setCount: vi.fn() })),
}));
vi.mock('../store/useToastStore', () => ({
  useToastStore: vi.fn(() => ({ show: vi.fn() })),
}));

const menProduct: Product = {
  id: 1,
  name: 'Bleu de Chanel',
  brand: 'Chanel',
  description: 'A fresh, clean masculine fragrance.',
  price: 120,
  imageUrl: 'https://example.com/img.jpg',
  stockQuantity: 10,
  category: 'MEN',
  size: '100ml',
};

function renderCard(product: Product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name', () => {
    renderCard(menProduct);
    expect(screen.getByText('Bleu de Chanel')).toBeInTheDocument();
  });

  it('renders product brand', () => {
    renderCard(menProduct);
    expect(screen.getByText('Chanel')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    renderCard(menProduct);
    expect(screen.getByText('$120.00')).toBeInTheDocument();
  });

  it('renders product size', () => {
    renderCard(menProduct);
    expect(screen.getByText('100ml')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderCard(menProduct);
    expect(screen.getByText('MEN')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    renderCard(menProduct);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('shows Sold Out overlay when stockQuantity is 0', () => {
    renderCard({ ...menProduct, stockQuantity: 0 });
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
  });

  it('shows Out of Stock button text when stockQuantity is 0', () => {
    renderCard({ ...menProduct, stockQuantity: 0 });
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeInTheDocument();
  });

  it('does not show Sold Out when in stock', () => {
    renderCard(menProduct);
    expect(screen.queryByText('Sold Out')).not.toBeInTheDocument();
  });

  it('shows Sign in to Buy when user is not authenticated', () => {
    renderCard(menProduct);
    expect(screen.getByRole('button', { name: 'Sign in to Buy' })).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    renderCard(menProduct);
    const img = screen.getByAltText('Bleu de Chanel');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg');
  });
});
