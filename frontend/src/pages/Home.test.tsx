import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import type { Product } from '../types';

vi.mock('../api/products', () => ({
  getProducts: vi.fn(),
}));

import { getProducts } from '../api/products';
const mockGetProducts = vi.mocked(getProducts);

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
    description: "A feminine fragrance",
    price: 110,
    imageUrl: '',
    stockQuantity: 5,
    category: 'WOMEN',
    size: '50ml',
  },
];

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
    mockGetProducts.mockResolvedValue([]);
  });

  it('renders heading', async () => {
    renderHome();
    expect(screen.getByText('Discover Your Scent')).toBeInTheDocument();
  });

  it('renders category filter buttons', async () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'ALL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MEN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'WOMEN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UNISEX' })).toBeInTheDocument();
  });

  it('calls getProducts with no category by default (ALL selected)', async () => {
    renderHome();
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(undefined);
    });
  });

  it('renders products after loading', async () => {
    mockGetProducts.mockResolvedValue(mockProducts);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Bleu de Chanel')).toBeInTheDocument();
      expect(screen.getByText('Coco Mademoiselle')).toBeInTheDocument();
    });
  });

  it('shows empty state when no products found', async () => {
    mockGetProducts.mockResolvedValue([]);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('No products found in this category.')).toBeInTheDocument();
    });
  });

  it('filters by category when button is clicked', async () => {
    mockGetProducts.mockResolvedValue([mockProducts[0]]);
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: 'MEN' }));

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith('MEN');
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
