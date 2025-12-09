import { describe, it, expect, beforeEach } from 'vitest';
import { collaborationManager, type SimulationState } from '@/lib/collaboration-manager';

function makeState(overrides: Partial<SimulationState> = {}): SimulationState {
  return {
    id: 'sim-1',
    name: 'Test Simulation',
    module: 'Graphene Band Structure',
    parameters: { nPoints: 50, temperature: 300 },
    timestamp: Date.now(),
    version: '1.0.0',
    ...overrides,
  };
}

describe('collaboration-manager', () => {
  beforeEach(() => {
    localStorage.clear();
    // reset URL
    window.history.replaceState({}, '', '/');
  });

  it('exports and imports simulation state JSON', () => {
    const state = makeState();
    const json = collaborationManager.exportSimulation(state);
    const parsed = collaborationManager.importSimulation(json);
    expect(parsed).toMatchObject({ id: state.id, name: state.name, module: state.module });
  });

  it('saves, lists, and deletes simulations in localStorage', () => {
    const state = makeState({ id: 'abc' });
    collaborationManager.saveSimulation(state);
    const saved = collaborationManager.getSavedSimulations();
    expect(saved['abc']).toBeDefined();
    collaborationManager.deleteSimulation('abc');
    const after = collaborationManager.getSavedSimulations();
    expect(after['abc']).toBeUndefined();
  });

  it('generates and loads from a shareable URL', () => {
    const state = makeState();
    const url = collaborationManager.generateShareableURL(state);
    // push to history to simulate navigation
    window.history.pushState({}, '', url);
    const loaded = collaborationManager.loadFromShareableURL();
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe(state.name);
  });

  it('creates a collaboration session', () => {
    const session = collaborationManager.createSession('Test Session', true);
    expect(session.name).toBe('Test Session');
    expect(session.isPublic).toBe(true);
    expect(collaborationManager.getActiveSession()).toMatchObject({ id: session.id });
  });
});
