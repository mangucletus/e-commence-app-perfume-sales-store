import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import type { Product, PagedResponse } from '../types';

vi.mock('../api/products', () => ({
  getProducts: vi.fn(),
  getBrands: vi.fn(),
}));

vi.mock('../store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({ token: null })),
}));

vi.mock('../store/useCartStore', () => ({
  useCartStore: vi.fn(() => ({ count: 0, setCount: vi.fn() })),
}));

vi.mock('../store/useToastStore', () => ({
  useToastStore: vi.fn(() => ({ show: vi.fn() })),
}));

import { getProducts, getBrands } from '../api/products';
const mockGetProducts = vi.mocked(getProducts);
const mockGetBrands = vi.mocked(getBrands);

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    description: 'A masculine fragrance',
    price: 120,
    imageUrl: '',
    stockQuantity: 10,
    category: 'MEN',
    size: '100ml',
  },
  {
    id: 2,
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    description: 'A feminine fragrance',
    price: 110,
    imageUrl: '',
    stockQuantity: 5,
    category: 'WOMEN',
    size: '50ml',
  },
];

const emptyPage: PagedResponse<Product> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 12,
  first: true,
  last: true,
};

const filledPage: PagedResponse<Product> = {
  content: mockProducts,
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 12,
  first: true,
  last: true,
};

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProducts.mockResolvedValue(emptyPage);
    mockGetBrands.mockResolvedValue([]);
  });

  it('renders hero heading', async () => {
    renderHome();
    expect(screen.getByText(/Discover Your/i)).toBeInTheDocument();
  });

  it('renders category filter buttons', async () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Men' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Women' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unisex' })).toBeInTheDocument();
  });

  it('calls getProducts on mount', async () => {
    renderHome();
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalled();
    });
  });

  it('renders products after loading', async () => {
    mockGetProducts.mockResolvedValue(filledPage);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Bleu de Chanel')).toBeInTheDocument();
      expect(screen.getByText('Coco Mademoiselle')).toBeInTheDocument();
    });
  });

  it('shows empty state when no products found', async () => {
    mockGetProducts.mockResolvedValue(emptyPage);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  it('shows error message when API fails', async () => {
    mockGetProducts.mockRejectedValue(new Error('Network error'));
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });
  });
});
