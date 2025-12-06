import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { vec3, solveLLGRK4, calculateEffectiveField, calculateEnergy } from './llg-numerics';

export interface LLGState {
  // Magnetization state
  magnetization: [number, number, number];
  effectiveField: [number, number, number];
  torque: [number, number, number];

  // Initial conditions
  initialTheta: number; // Initial polar angle (0 to π)
  initialPhi: number; // Initial azimuthal angle (0 to 2π)

  // Time series data
  timeData: number[];
  magnetizationHistory: [number, number, number][];
  energyHistory: number[];

  // Physical parameters
  appliedField: {
    magnitude: number;
    direction: [number, number, number];
  };
  gilbert_damping: number;
  anisotropy: {
    strength: number;
    easyAxis: [number, number, number];
  };
  gyromagneticRatio: number;

  // Simulation state
  isRunning: boolean;
  time: number;
  dt: number;

  // Visualization options
  showEffectiveField: boolean;
  showTorque: boolean;
  showTrajectory: boolean;
  show2DPlots: boolean;

  // UI state
  activeTab: string;
}

export interface LLGActions {
  // Simulation control
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;

  // Parameter updates
  setAppliedField: (magnitude: number, direction: [number, number, number]) => void;
  setGilbertDamping: (alpha: number) => void;
  setAnisotropy: (strength: number, easyAxis: [number, number, number]) => void;
  setInitialTheta: (theta: number) => void;
  setInitialPhi: (phi: number) => void;
  setRandomInitialPosition: () => void;

  // Visualization toggles
  toggleEffectiveField: () => void;
  toggleTorque: () => void;
  toggleTrajectory: () => void;
  toggle2DPlots: () => void;

  // UI actions
  setActiveTab: (tab: string) => void;
  exportTrajectory: () => void;
  clearHistory: () => void;
}

// Vector utility functions
export { vec3 };

// Enhanced LLG solver with RK4 integration for numerical stability

// Calculate effective field components

// Calculate magnetic energy
export { solveLLGRK4, calculateEffectiveField, calculateEnergy };

export const useLLGStore = create<LLGState & LLGActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    initialTheta: Math.PI / 4, // 45 degrees
    initialPhi: 0, // 0 degrees
    magnetization: [
      Math.sin(Math.PI / 4) * Math.cos(0),
      Math.sin(Math.PI / 4) * Math.sin(0),
      Math.cos(Math.PI / 4)
    ],
    effectiveField: [0, 0, 0],
    torque: [0, 0, 0],

    timeData: [],
    magnetizationHistory: [],
    energyHistory: [],

    appliedField: {
      magnitude: 0.1,
      direction: [0, 0, 1]
    },
    gilbert_damping: 0.1,
    anisotropy: {
      strength: 0.01,
      easyAxis: [0, 0, 1]
    },
    gyromagneticRatio: 2.21e5, // rad/s/T

    isRunning: false,
    time: 0,
    dt: 1e-12, // 1 picosecond

    showEffectiveField: true,
    showTorque: false,
    showTrajectory: true,
    show2DPlots: true,

    activeTab: 'simulation',

    // Actions
    startSimulation: () => set({ isRunning: true }),
    pauseSimulation: () => set({ isRunning: false }),

    resetSimulation: () => {
      const state = get();
      const magnetization: [number, number, number] = [
        Math.sin(state.initialTheta) * Math.cos(state.initialPhi),
        Math.sin(state.initialTheta) * Math.sin(state.initialPhi),
        Math.cos(state.initialTheta)
      ];
      set({
        magnetization,
        effectiveField: [0, 0, 0],
        torque: [0, 0, 0],
        timeData: [],
        magnetizationHistory: [],
        energyHistory: [],
        time: 0,
        isRunning: false
      });
    },

    stepSimulation: () => {
      const state = get();

      const appliedFieldVector = vec3.scale(
        vec3.normalize(state.appliedField.direction),
        state.appliedField.magnitude
      );

      const effectiveField = calculateEffectiveField(
        state.magnetization,
        appliedFieldVector,
        state.anisotropy.strength,
        state.anisotropy.easyAxis
      );

      const newMagnetization = solveLLGRK4(
        state.magnetization,
        effectiveField,
        state.gilbert_damping,
        state.gyromagneticRatio,
        state.dt
      );

      // Calculate torque: τ = m × H_eff
      const torque = vec3.cross(state.magnetization, effectiveField);

      // Calculate energy
      const energy = calculateEnergy(
        newMagnetization,
        appliedFieldVector,
        state.anisotropy.strength,
        state.anisotropy.easyAxis
      );

      // Update history (keep last 10000 points)
      const newTime = state.time + state.dt;
      const newTimeData = [...state.timeData, newTime].slice(-10000);
      const newMagHistory = [...state.magnetizationHistory, newMagnetization].slice(-10000);
      const newEnergyHistory = [...state.energyHistory, energy].slice(-10000);

      set({
        magnetization: newMagnetization,
        effectiveField,
        torque,
        time: newTime,
        timeData: newTimeData,
        magnetizationHistory: newMagHistory,
        energyHistory: newEnergyHistory
      });
    },

    setAppliedField: (magnitude, direction) => set(state => ({
      appliedField: { magnitude, direction }
    })),

    setGilbertDamping: (alpha) => set({ gilbert_damping: alpha }),

    setAnisotropy: (strength, easyAxis) => set(state => ({
      anisotropy: { strength, easyAxis }
    })),

    setInitialTheta: (theta) => {
      const state = get();
      const phi = state.initialPhi;
      const magnetization: [number, number, number] = [
        Math.sin(theta) * Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(theta)
      ];
      set({ initialTheta: theta, magnetization });
    },

    setInitialPhi: (phi) => {
      const state = get();
      const theta = state.initialTheta;
      const magnetization: [number, number, number] = [
        Math.sin(theta) * Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(theta)
      ];
      set({ initialPhi: phi, magnetization });
    },

    setRandomInitialPosition: () => {
      const theta = Math.acos(2 * Math.random() - 1); // Uniform on sphere
      const phi = 2 * Math.PI * Math.random();
      const magnetization: [number, number, number] = [
        Math.sin(theta) * Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(theta)
      ];
      set({ initialTheta: theta, initialPhi: phi, magnetization });
    },

    toggleEffectiveField: () => set(state => ({ showEffectiveField: !state.showEffectiveField })),
    toggleTorque: () => set(state => ({ showTorque: !state.showTorque })),
    toggleTrajectory: () => set(state => ({ showTrajectory: !state.showTrajectory })),
    toggle2DPlots: () => set(state => ({ show2DPlots: !state.show2DPlots })),

    setActiveTab: (tab) => set({ activeTab: tab }),

    exportTrajectory: () => {
      const state = get();

      const csvData = [
        ['Time (s)', 'mx', 'my', 'mz', '|m|', 'Energy (J)'].join(','),
        ...state.timeData.map((t, i) => {
          const m = state.magnetizationHistory[i];
          const mag = m ? vec3.magnitude(m) : 0;
          const energy = state.energyHistory[i] || 0;
          return [
            t.toExponential(6),
            m?.[0]?.toFixed(6) || '0',
            m?.[1]?.toFixed(6) || '0',
            m?.[2]?.toFixed(6) || '0',
            mag.toFixed(6),
            energy.toExponential(6)
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `llg_trajectory_${Date.now()}.csv`;
      link.click();
    },

    clearHistory: () => set({
      timeData: [],
      magnetizationHistory: [],
      energyHistory: [],
      time: 0
    })
  }))
);
