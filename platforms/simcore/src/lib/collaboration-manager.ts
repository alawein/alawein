import { toast } from "@/hooks/use-toast";

export interface SimulationState {
  id: string;
  name: string;
  module: string;
  parameters: Record<string, any>;
  timestamp: number;
  version: string;
}

export interface CollaborationSession {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
  participants: string[];
  isPublic: boolean;
}

class CollaborationManager {
  private readonly storageKey = 'quantum-simulations';
  private readonly sessionKey = 'active-session';
  
  // Export simulation state
  exportSimulation(state: SimulationState): string {
    try {
      return JSON.stringify(state, null, 2);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export simulation state",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Import simulation state
  importSimulation(jsonString: string): SimulationState {
    try {
      const state = JSON.parse(jsonString);
      if (!this.validateSimulationState(state)) {
        throw new Error('Invalid simulation state format');
      }
      return state;
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid simulation file format",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Generate shareable URL
  generateShareableURL(state: SimulationState): string {
    try {
      const encodedState = btoa(JSON.stringify(state));
      const baseURL = window.location.origin + window.location.pathname;
      return `${baseURL}?shared=${encodedState}`;
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not generate shareable link",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Load from shareable URL
  loadFromShareableURL(): SimulationState | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedState = urlParams.get('shared');
      
      if (!sharedState) return null;
      
      const decodedState = JSON.parse(atob(sharedState));
      if (!this.validateSimulationState(decodedState)) {
        throw new Error('Invalid shared state');
      }
      
      toast({
        title: "Simulation Loaded",
        description: "Shared simulation loaded successfully",
      });
      
      return decodedState;
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Could not load shared simulation",
        variant: "destructive",
      });
      return null;
    }
  }

  // Save simulation locally
  saveSimulation(state: SimulationState): void {
    try {
      const saved = this.getSavedSimulations();
      saved[state.id] = state;
      localStorage.setItem(this.storageKey, JSON.stringify(saved));
      
      toast({
        title: "Simulation Saved",
        description: `"${state.name}" saved locally`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save simulation",
        variant: "destructive",
      });
    }
  }

  // Get saved simulations
  getSavedSimulations(): Record<string, SimulationState> {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // Delete saved simulation
  deleteSimulation(id: string): void {
    try {
      const saved = this.getSavedSimulations();
      delete saved[id];
      localStorage.setItem(this.storageKey, JSON.stringify(saved));
      
      toast({
        title: "Simulation Deleted",
        description: "Simulation removed from local storage",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete simulation",
        variant: "destructive",
      });
    }
  }

  // Create collaboration session
  createSession(name: string, isPublic: boolean = false): CollaborationSession {
    const session: CollaborationSession = {
      id: this.generateId(),
      name,
      createdAt: Date.now(),
      lastModified: Date.now(),
      participants: [this.getUserId()],
      isPublic,
    };
    
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    toast({
      title: "Session Created",
      description: `Collaboration session "${name}" created`,
    });
    
    return session;
  }

  // Get active session
  getActiveSession(): CollaborationSession | null {
    try {
      const session = localStorage.getItem(this.sessionKey);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  // Copy to clipboard
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  }

  // Download as file
  downloadAsFile(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download file",
        variant: "destructive",
      });
    }
  }

  private validateSimulationState(state: any): state is SimulationState {
    return (
      typeof state === 'object' &&
      typeof state.id === 'string' &&
      typeof state.name === 'string' &&
      typeof state.module === 'string' &&
      typeof state.parameters === 'object' &&
      typeof state.timestamp === 'number' &&
      typeof state.version === 'string'
    );
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string {
    let userId = localStorage.getItem('user-id');
    if (!userId) {
      userId = `user-${this.generateId()}`;
      localStorage.setItem('user-id', userId);
    }
    return userId;
  }
}

export const collaborationManager = new CollaborationManager();