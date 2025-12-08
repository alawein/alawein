// Comprehensive Test Suite for Recommendations Feature
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RecommendationCard,
  RecommendationCarousel,
  SimilarProducts,
  RecentlyViewed,
  CompleteTheLook,
  useViewHistory
} from '../index';

// Mock data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: '/test.jpg',
  category: 'tops',
  tags: ['casual', 'cotton'],
  inStock: true
};

const mockProducts = [
  mockProduct,
  {
    id: '2',
    name: 'Similar Product',
    price: 34.99,
    image: '/test2.jpg',
    category: 'tops',
    tags: ['casual', 'linen'],
    inStock: true
  },
  {
    id: '3',
    name: 'Different Product',
    price: 59.99,
    image: '/test3.jpg',
    category: 'bottoms',
    tags: ['formal'],
    inStock: false
  }
];

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('RecommendationCard', () => {
  it('renders product information correctly', () => {
    const onAddToCart = vi.fn();
    render(
      <RecommendationCard product={mockProduct} onAddToCart={onAddToCart} />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    render(
      <RecommendationCard product={mockProduct} onAddToCart={onAddToCart} />
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('disables add to cart for out of stock products', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(
      <RecommendationCard product={outOfStockProduct} onAddToCart={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeDisabled();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows wishlist button when handler provided', () => {
    const onWishlist = vi.fn();
    render(
      <RecommendationCard
        product={mockProduct}
        onAddToCart={vi.fn()}
        onWishlist={onWishlist}
      />
    );

    const wishlistButton = screen.getByRole('button', { name: '' }); // Heart icon
    fireEvent.click(wishlistButton);
    expect(onWishlist).toHaveBeenCalledWith(mockProduct);
  });
});

describe('useViewHistory Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => useViewHistory());
    expect(result.current.history).toEqual([]);
  });

  it('adds product to history', () => {
    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      result.current.addToHistory(mockProduct);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toEqual(mockProduct);
  });

  it('prevents duplicate products in history', () => {
    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      result.current.addToHistory(mockProduct);
      result.current.addToHistory(mockProduct);
    });

    expect(result.current.history).toHaveLength(1);
  });

  it('limits history to 20 items', () => {
    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      for (let i = 0; i < 25; i++) {
        result.current.addToHistory({ ...mockProduct, id: `${i}` });
      }
    });

    expect(result.current.history).toHaveLength(20);
  });

  it('persists history to localStorage', () => {
    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      result.current.addToHistory(mockProduct);
    });

    const stored = localStorage.getItem('liveit-view-history');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      result.current.addToHistory(mockProduct);
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(localStorage.getItem('liveit-view-history')).toBeNull();
  });
});

describe('Similarity Engine', () => {
  it('scores category matches highest', () => {
    const product1 = { ...mockProduct, category: 'tops' };
    const product2 = { ...mockProduct, id: '2', category: 'tops' };
    
    // Import calculateSimilarity function
    const score = calculateSimilarity(product1, product2);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it('scores tag overlap correctly', () => {
    const product1 = { ...mockProduct, tags: ['casual', 'cotton'] };
    const product2 = { ...mockProduct, id: '2', tags: ['casual', 'linen'] };
    
    const score = calculateSimilarity(product1, product2);
    expect(score).toBeGreaterThan(0);
  });

  it('scores price similarity', () => {
    const product1 = { ...mockProduct, price: 30 };
    const product2 = { ...mockProduct, id: '2', price: 32 };
    
    const score = calculateSimilarity(product1, product2);
    expect(score).toBeGreaterThan(0);
  });

  it('finds similar products correctly', () => {
    const current = mockProduct;
    const similar = findSimilarProducts(current, mockProducts, 2);
    
    expect(similar).toHaveLength(2);
    expect(similar[0].id).not.toBe(current.id);
  });
});

describe('RecommendationCarousel', () => {
  it('renders loading skeletons while loading', () => {
    render(
      <RecommendationCarousel title="Test Carousel" type="trending" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Carousel')).toBeInTheDocument();
    // Check for loading skeletons
    const skeletons = screen.getAllByRole('presentation');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders products after loading', async () => {
    // Mock the API call
    vi.mock('../index', () => ({
      fetchRecommendations: vi.fn().mockResolvedValue(mockProducts)
    }));

    render(
      <RecommendationCarousel title="Test Carousel" type="trending" />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('shows navigation buttons', () => {
    render(
      <RecommendationCarousel title="Test Carousel" type="trending" />,
      { wrapper: createWrapper() }
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Left and right buttons
  });
});

describe('SimilarProducts', () => {
  it('renders similar products grid', async () => {
    render(
      <SimilarProducts currentProduct={mockProduct} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('You Might Also Like')).toBeInTheDocument();
    });
  });

  it('excludes current product from results', async () => {
    render(
      <SimilarProducts currentProduct={mockProduct} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const productCards = screen.queryAllByText('Test Product');
      // Should not show the current product
      expect(productCards.length).toBe(0);
    });
  });
});

describe('RecentlyViewed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty state when no history', () => {
    const { container } = render(<RecentlyViewed />);
    expect(container.firstChild).toBeNull();
  });

  it('renders recently viewed products', () => {
    // Add products to localStorage
    localStorage.setItem(
      'liveit-view-history',
      JSON.stringify([mockProduct])
    );

    render(<RecentlyViewed />);
    
    expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('shows clear history button', () => {
    localStorage.setItem(
      'liveit-view-history',
      JSON.stringify([mockProduct])
    );

    render(<RecentlyViewed />);
    
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears history when button clicked', () => {
    localStorage.setItem(
      'liveit-view-history',
      JSON.stringify([mockProduct])
    );

    render(<RecentlyViewed />);
    
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    fireEvent.click(clearButton);

    expect(localStorage.getItem('liveit-view-history')).toBeNull();
  });
});

describe('CompleteTheLook', () => {
  it('renders outfit builder', async () => {
    render(
      <CompleteTheLook currentProduct={mockProduct} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Complete the Look')).toBeInTheDocument();
    });
  });

  it('calculates total price correctly', async () => {
    render(
      <CompleteTheLook currentProduct={mockProduct} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      // Should show total price for current + complementary products
      const priceElement = screen.getByText(/Total for/i);
      expect(priceElement).toBeInTheDocument();
    });
  });

  it('shows add all to cart button', async () => {
    render(
      <CompleteTheLook currentProduct={mockProduct} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const addAllButton = screen.getByRole('button', { name: /add all to cart/i });
      expect(addAllButton).toBeInTheDocument();
    });
  });
});

describe('Responsive Design', () => {
  it('renders correctly on mobile viewport', () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));

    render(
      <RecommendationCarousel title="Test" type="trending" />,
      { wrapper: createWrapper() }
    );

    // Check mobile-specific classes
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveClass('grid-cols-2');
  });

  it('renders correctly on desktop viewport', () => {
    global.innerWidth = 1920;
    global.dispatchEvent(new Event('resize'));

    render(
      <RecommendationCarousel title="Test" type="trending" />,
      { wrapper: createWrapper() }
    );

    // Check desktop-specific classes
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveClass('md:grid-cols-4');
  });
});

describe('Performance', () => {
  it('uses TanStack Query caching', async () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'getQueryData');

    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationCarousel title="Test" type="trending" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('limits carousel items for performance', async () => {
    render(
      <RecommendationCarousel title="Test" type="trending" />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const items = screen.getAllByRole('article');
      expect(items.length).toBeLessThanOrEqual(8); // Max 8 items
    });
  });
});

describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(
      <RecommendationCard product={mockProduct} onAddToCart={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toHaveAccessibleName();
  });

  it('supports keyboard navigation', () => {
    render(
      <RecommendationCarousel title="Test" type="trending" />,
      { wrapper: createWrapper() }
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex');
    });
  });

  it('has proper heading hierarchy', () => {
    render(
      <RecommendationCarousel title="Test Carousel" type="trending" />,
      { wrapper: createWrapper() }
    );

    const heading = screen.getByRole('heading', { name: 'Test Carousel' });
    expect(heading).toBeInTheDocument();
  });
});

describe('Error Handling', () => {
  it('handles API errors gracefully', async () => {
    // Mock API error
    vi.mock('../index', () => ({
      fetchRecommendations: vi.fn().mockRejectedValue(new Error('API Error'))
    }));

    render(
      <RecommendationCarousel title="Test" type="trending" />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      // Should not crash, should show empty state or error message
      expect(screen.queryByText('Test')).toBeInTheDocument();
    });
  });

  it('handles localStorage errors', () => {
    // Mock localStorage error
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useViewHistory());
    
    act(() => {
      result.current.addToHistory(mockProduct);
    });

    // Should not crash
    expect(result.current.history).toBeDefined();
    
    mockSetItem.mockRestore();
  });
});
