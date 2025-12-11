/**
 * @file uiStore.test.ts
 * @description Tests for uiStore Zustand store
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useUIStore.setState({
      sidebarOpen: true,
      modalOpen: false,
      currentModal: null,
    });
  });

  it('should have correct initial state', () => {
    const state = useUIStore.getState();
    expect(state.sidebarOpen).toBe(true);
    expect(state.modalOpen).toBe(false);
    expect(state.currentModal).toBeNull();
  });

  it('should toggle sidebar', () => {
    const { toggleSidebar } = useUIStore.getState();
    
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('should set sidebar open state directly', () => {
    const { setSidebarOpen } = useUIStore.getState();
    
    setSidebarOpen(false);
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    setSidebarOpen(true);
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('should open modal with correct id', () => {
    const { openModal } = useUIStore.getState();
    
    openModal('test-modal');
    const state = useUIStore.getState();
    expect(state.modalOpen).toBe(true);
    expect(state.currentModal).toBe('test-modal');
  });

  it('should close modal and reset currentModal', () => {
    const { openModal, closeModal } = useUIStore.getState();
    
    openModal('test-modal');
    expect(useUIStore.getState().modalOpen).toBe(true);
    
    closeModal();
    const state = useUIStore.getState();
    expect(state.modalOpen).toBe(false);
    expect(state.currentModal).toBeNull();
  });
});
