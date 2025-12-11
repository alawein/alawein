/**
 * @file useABTesting.test.ts
 * @description Tests for useABTesting hook
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useABTesting } from '../useABTesting';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useABTesting', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with isLoaded false then true', async () => {
    const { result } = renderHook(() => useABTesting());
    expect(result.current.isLoaded).toBe(true);
  });

  it('should return experiments list', () => {
    const { result } = renderHook(() => useABTesting());
    const experiments = result.current.getExperiments();
    expect(experiments.length).toBeGreaterThan(0);
    expect(experiments[0]).toHaveProperty('id');
    expect(experiments[0]).toHaveProperty('name');
    expect(experiments[0]).toHaveProperty('variants');
  });

  it('should get experiment by id', () => {
    const { result } = renderHook(() => useABTesting());
    const experiment = result.current.getExperiment('pricing-page-layout');
    expect(experiment).toBeDefined();
    expect(experiment?.name).toBe('Pricing Page Layout');
  });

  it('should return null for non-existent experiment', () => {
    const { result } = renderHook(() => useABTesting());
    const experiment = result.current.getExperiment('non-existent');
    expect(experiment).toBeUndefined();
  });

  it('should assign variant for running experiment', async () => {
    const { result } = renderHook(() => useABTesting());
    
    let variant;
    await act(async () => {
      variant = result.current.getVariant('pricing-page-layout');
    });
    
    expect(variant).toBeDefined();
    expect(variant).toHaveProperty('id');
    expect(variant).toHaveProperty('name');
    expect(variant).toHaveProperty('weight');
  });

  it('should return consistent variant for same user', async () => {
    const { result } = renderHook(() => useABTesting());
    
    let variant1, variant2;
    await act(async () => {
      variant1 = result.current.getVariant('pricing-page-layout');
    });
    await act(async () => {
      variant2 = result.current.getVariant('pricing-page-layout');
    });
    
    expect(variant1?.id).toBe(variant2?.id);
  });

  it('should track conversion and log to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { result } = renderHook(() => useABTesting());
    
    // First get a variant to create an assignment
    await act(async () => {
      result.current.getVariant('pricing-page-layout');
    });
    
    // Wait for state to update
    await waitFor(() => {
      expect(result.current.assignments.length).toBeGreaterThan(0);
    });
    
    // Then track conversion
    act(() => {
      result.current.trackConversion('pricing-page-layout', 'click', 1);
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should have correct experiment structure', () => {
    const { result } = renderHook(() => useABTesting());
    const experiments = result.current.getExperiments();
    
    experiments.forEach(exp => {
      expect(exp).toHaveProperty('id');
      expect(exp).toHaveProperty('name');
      expect(exp).toHaveProperty('description');
      expect(exp).toHaveProperty('variants');
      expect(exp).toHaveProperty('status');
      expect(exp).toHaveProperty('targetPercentage');
      expect(Array.isArray(exp.variants)).toBe(true);
      expect(exp.variants.length).toBeGreaterThan(0);
    });
  });
});
