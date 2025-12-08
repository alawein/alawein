import { useState, useEffect, useCallback } from 'react';
import { ViewHistoryItem } from '../types';

const STORAGE_KEY = 'liveitIconic_viewHistory';
const MAX_HISTORY_ITEMS = 100;

export const useViewHistory = () => {
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load view history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const history = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setViewHistory(history);
      }
    } catch (error) {
      console.error('Failed to load view history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save view history to localStorage
  const saveViewHistory = useCallback((history: ViewHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setViewHistory(history);
    } catch (error) {
      console.error('Failed to save view history:', error);
    }
  }, []);

  const addToViewHistory = useCallback((productId: string, category: string, duration?: number) => {
    const newItem: ViewHistoryItem = {
      productId,
      category,
      timestamp: new Date(),
      duration,
    };

    const updatedHistory = [
      newItem,
      ...viewHistory.filter(item => item.productId !== productId),
    ].slice(0, MAX_HISTORY_ITEMS);

    saveViewHistory(updatedHistory);
  }, [viewHistory, saveViewHistory]);

  const getRecentlyViewed = useCallback((limit = 10) => {
    return viewHistory.slice(0, limit);
  }, [viewHistory]);

  const getViewedInCategory = useCallback((category: string, limit = 10) => {
    return viewHistory
      .filter(item => item.category === category)
      .slice(0, limit);
  }, [viewHistory]);

  const clearViewHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setViewHistory([]);
  }, []);

  const getViewCount = useCallback((productId: string) => {
    return viewHistory.filter(item => item.productId === productId).length;
  }, [viewHistory]);

  return {
    viewHistory,
    isLoading,
    addToViewHistory,
    getRecentlyViewed,
    getViewedInCategory,
    clearViewHistory,
    getViewCount,
  };
};
