import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';

// Crystal structure definitions
export interface AtomData {
  position: [number, number, number];
  element: string;
  color: string;
  fractionalCoords: [number, number, number];
  id: string;
}

export interface CrystalStructure {
  name: string;
  system: string;
  latticeType: string;
  latticeVectors: [number, number, number][];
  latticeParameters: {
    a: number;
    b: number;
    c: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
  basisAtoms: {
    position: [number, number, number];
    element: string;
    color: string;
  }[];
  spaceGroup: string;
  pointGroup: string;
  examples: string[];
  brillouinZone: string;
}

export interface MillerPlane {
  indices: [number, number, number];
  color: string;
  opacity: number;
  visible: boolean;
}

export interface SymmetryOperation {
  type: 'rotation' | 'reflection' | 'inversion' | 'translation';
  matrix: number[][];
  description: string;
  visible: boolean;
}

interface CrystalState {
  // Structure selection
  selectedStructure: string;
  customStructure: CrystalStructure | null;

  // Lattice parameters
  latticeConstant: number;
  supercell: [number, number, number];
  showPrimitiveCell: boolean;

  // Visualization options
  atoms: AtomData[];
  showAtoms: boolean;
  showBonds: boolean;
  showUnitCell: boolean;
  showAxes: boolean;
  atomScale: number;
  bondCutoff: number;

  // Advanced features
  millerPlanes: MillerPlane[];
  showSymmetryOperations: boolean;
  symmetryOperations: SymmetryOperation[];
  showReciprocalLattice: boolean;
  showBrillouinZone: boolean;
  showWignerSeitzCell: boolean;

  // Performance settings
  lodLevel: number;
  maxAtoms: number;

  // UI state
  activePanel: string;
  isLoading: boolean;

  // Export settings
  exportFormat: 'cif' | 'xyz' | 'json';
}

interface CrystalActions {
  setSelectedStructure: (structure: string) => void;
  setLatticeConstant: (value: number) => void;
  setSupercell: (supercell: [number, number, number]) => void;
  toggleShowAtoms: () => void;
  toggleShowBonds: () => void;
  toggleShowUnitCell: () => void;
  toggleShowAxes: () => void;
  setAtomScale: (scale: number) => void;
  setBondCutoff: (cutoff: number) => void;
  addMillerPlane: (indices: [number, number, number]) => void;
  removeMillerPlane: (index: number) => void;
  toggleMillerPlane: (index: number) => void;
  toggleSymmetryOperations: () => void;
  toggleReciprocalLattice: () => void;
  toggleBrillouinZone: () => void;
  toggleWignerSeitzCell: () => void;
  setActivePanel: (panel: string) => void;
  generateAtoms: () => void;
  exportStructure: () => void;
  resetView: () => void;
}

// Crystal structure database
export const crystalStructures: Record<string, CrystalStructure> = {
  diamond: {
    name: 'Diamond Structure',
    system: 'Cubic',
    latticeType: 'Face-centered',
    latticeVectors: [[0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]],
    latticeParameters: { a: 3.567, b: 3.567, c: 3.567, alpha: 90, beta: 90, gamma: 90 },
    basisAtoms: [
      { position: [0, 0, 0], element: 'C', color: '#888888' },
      { position: [0.25, 0.25, 0.25], element: 'C', color: '#888888' }
    ],
    spaceGroup: 'Fd-3m',
    pointGroup: 'm-3m',
    examples: ['C (diamond)', 'Si', 'Ge'],
    brillouinZone: 'truncated_octahedron'
  },
  fcc: {
    name: 'Face-Centered Cubic',
    system: 'Cubic',
    latticeType: 'Face-centered',
    latticeVectors: [[0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]],
    latticeParameters: { a: 4.08, b: 4.08, c: 4.08, alpha: 90, beta: 90, gamma: 90 },
    basisAtoms: [{ position: [0, 0, 0], element: 'Cu', color: '#b87333' }],
    spaceGroup: 'Fm-3m',
    pointGroup: 'm-3m',
    examples: ['Cu', 'Au', 'Ag', 'Al'],
    brillouinZone: 'truncated_octahedron'
  },
  bcc: {
    name: 'Body-Centered Cubic',
    system: 'Cubic',
    latticeType: 'Body-centered',
    latticeVectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    latticeParameters: { a: 2.87, b: 2.87, c: 2.87, alpha: 90, beta: 90, gamma: 90 },
    basisAtoms: [
      { position: [0, 0, 0], element: 'Fe', color: '#8c7853' },
      { position: [0.5, 0.5, 0.5], element: 'Fe', color: '#8c7853' }
    ],
    spaceGroup: 'Im-3m',
    pointGroup: 'm-3m',
    examples: ['Fe', 'Cr', 'W', 'Mo'],
    brillouinZone: 'rhombic_dodecahedron'
  },
  nacl: {
    name: 'Rock Salt (NaCl)',
    system: 'Cubic',
    latticeType: 'Face-centered',
    latticeVectors: [[0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]],
    latticeParameters: { a: 5.64, b: 5.64, c: 5.64, alpha: 90, beta: 90, gamma: 90 },
    basisAtoms: [
      { position: [0, 0, 0], element: 'Na', color: '#ab5cf2' },
      { position: [0.5, 0.5, 0.5], element: 'Cl', color: '#22c55e' }
    ],
    spaceGroup: 'Fm-3m',
    pointGroup: 'm-3m',
    examples: ['NaCl', 'MgO', 'CaO'],
    brillouinZone: 'truncated_octahedron'
  },
  hexagonal: {
    name: 'Hexagonal Close Packed',
    system: 'Hexagonal',
    latticeType: 'Primitive',
    latticeVectors: [[1, 0, 0], [-0.5, Math.sqrt(3)/2, 0], [0, 0, Math.sqrt(8/3)]],
    latticeParameters: { a: 2.95, b: 2.95, c: 4.68, alpha: 90, beta: 90, gamma: 120 },
    basisAtoms: [
      { position: [0, 0, 0], element: 'Zn', color: '#7194b3' },
      { position: [1/3, 2/3, 0.5], element: 'Zn', color: '#7194b3' }
    ],
    spaceGroup: 'P63/mmc',
    pointGroup: '6/mmm',
    examples: ['Zn', 'Mg', 'Ti', 'Co'],
    brillouinZone: 'hexagonal_prism'
  },
  graphene: {
    name: 'Graphene',
    system: 'Hexagonal',
    latticeType: 'Primitive',
    latticeVectors: [[1, 0, 0], [-0.5, Math.sqrt(3)/2, 0], [0, 0, 0]],
    latticeParameters: { a: 2.46, b: 2.46, c: 10.0, alpha: 90, beta: 90, gamma: 120 },
    basisAtoms: [
      { position: [0, 0, 0], element: 'C', color: '#888888' },
      { position: [1/3, 2/3, 0], element: 'C', color: '#888888' }
    ],
    spaceGroup: 'P6/mmm',
    pointGroup: '6/mmm',
    examples: ['Graphene', 'BN monolayer'],
    brillouinZone: 'hexagon'
  }
};

export const useCrystalStore = create<CrystalState & CrystalActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedStructure: 'diamond',
    customStructure: null,
    latticeConstant: 1.0,
    supercell: [1, 1, 1],
    showPrimitiveCell: true,
    atoms: [],
    showAtoms: true,
    showBonds: true,
    showUnitCell: true,
    showAxes: true,
    atomScale: 1.0,
    bondCutoff: 1.8,
    millerPlanes: [],
    showSymmetryOperations: false,
    symmetryOperations: [],
    showReciprocalLattice: false,
    showBrillouinZone: false,
    showWignerSeitzCell: false,
    lodLevel: 1,
    maxAtoms: 1000,
    activePanel: 'structure',
    isLoading: false,
    exportFormat: 'cif',

    // Actions
    setSelectedStructure: (structure) => {
      set({ selectedStructure: structure });
      get().generateAtoms();
    },

    setLatticeConstant: (value) => {
      set({ latticeConstant: value });
      get().generateAtoms();
    },

    setSupercell: (supercell) => {
      set({ supercell });
      get().generateAtoms();
    },

    toggleShowAtoms: () => set((state) => ({ showAtoms: !state.showAtoms })),
    toggleShowBonds: () => set((state) => ({ showBonds: !state.showBonds })),
    toggleShowUnitCell: () => set((state) => ({ showUnitCell: !state.showUnitCell })),
    toggleShowAxes: () => set((state) => ({ showAxes: !state.showAxes })),

    setAtomScale: (scale) => set({ atomScale: scale }),
    setBondCutoff: (cutoff) => set({ bondCutoff: cutoff }),

    addMillerPlane: (indices) => {
      const newPlane: MillerPlane = {
        indices,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        opacity: 0.3,
        visible: true
      };
      set((state) => ({ millerPlanes: [...state.millerPlanes, newPlane] }));
    },

    removeMillerPlane: (index) => {
      set((state) => ({
        millerPlanes: state.millerPlanes.filter((_, i) => i !== index)
      }));
    },

    toggleMillerPlane: (index) => {
      set((state) => ({
        millerPlanes: state.millerPlanes.map((plane, i) =>
          i === index ? { ...plane, visible: !plane.visible } : plane
        )
      }));
    },

    toggleSymmetryOperations: () => set((state) => ({ showSymmetryOperations: !state.showSymmetryOperations })),
    toggleReciprocalLattice: () => set((state) => ({ showReciprocalLattice: !state.showReciprocalLattice })),
    toggleBrillouinZone: () => set((state) => ({ showBrillouinZone: !state.showBrillouinZone })),
    toggleWignerSeitzCell: () => set((state) => ({ showWignerSeitzCell: !state.showWignerSeitzCell })),

    setActivePanel: (panel) => set({ activePanel: panel }),

    generateAtoms: () => {
      const state = get();
      const structure = crystalStructures[state.selectedStructure];
      if (!structure) return;

      const atoms: AtomData[] = [];
      const { latticeVectors, basisAtoms } = structure;
      const [nx, ny, nz] = state.supercell;

      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
          for (let k = 0; k < nz; k++) {
            for (const atom of basisAtoms) {
              const position: [number, number, number] = [0, 0, 0];

              // Apply lattice vectors
              for (let l = 0; l < 3; l++) {
                position[l] = state.latticeConstant * (
                  i * latticeVectors[0][l] +
                  j * latticeVectors[1][l] +
                  k * latticeVectors[2][l] +
                  atom.position[l]
                );
              }

              atoms.push({
                position,
                element: atom.element,
                color: atom.color,
                fractionalCoords: [
                  i + atom.position[0],
                  j + atom.position[1],
                  k + atom.position[2]
                ],
                id: `${i}-${j}-${k}-${atom.element}`
              });
            }
          }
        }
      }

      set({ atoms });
    },

    exportStructure: () => {
      const state = get();
      const structure = crystalStructures[state.selectedStructure];

      let exportData = '';

      if (state.exportFormat === 'cif') {
        exportData = generateCIF(structure, state);
      } else if (state.exportFormat === 'xyz') {
        exportData = generateXYZ(state.atoms);
      } else {
        exportData = JSON.stringify({ structure, state }, null, 2);
      }

      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crystal.${state.exportFormat}`;
      link.click();
    },

    resetView: () => {
      set({
        latticeConstant: 1.0,
        supercell: [1, 1, 1],
        atomScale: 1.0,
        bondCutoff: 1.8,
        millerPlanes: [],
        showSymmetryOperations: false,
        showReciprocalLattice: false,
        showBrillouinZone: false,
        showWignerSeitzCell: false
      });
      get().generateAtoms();
    }
  }))
);

// Export utility functions
function generateCIF(structure: CrystalStructure, state: any): string {
  return `
# Generated CIF file
data_crystal
_cell_length_a    ${structure.latticeParameters.a * state.latticeConstant}
_cell_length_b    ${structure.latticeParameters.b * state.latticeConstant}
_cell_length_c    ${structure.latticeParameters.c * state.latticeConstant}
_cell_angle_alpha ${structure.latticeParameters.alpha}
_cell_angle_beta  ${structure.latticeParameters.beta}
_cell_angle_gamma ${structure.latticeParameters.gamma}
_space_group_name_H-M '${structure.spaceGroup}'

loop_
_atom_site_label
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
${structure.basisAtoms.map((atom, i) =>
  `${atom.element}${i+1} ${atom.position[0]} ${atom.position[1]} ${atom.position[2]}`
).join('\n')}
  `.trim();
}

function generateXYZ(atoms: AtomData[]): string {
  return `${atoms.length}
Crystal structure
${atoms.map(atom =>
  `${atom.element} ${atom.position[0].toFixed(6)} ${atom.position[1].toFixed(6)} ${atom.position[2].toFixed(6)}`
).join('\n')}`;
}

// Initialize atoms on store creation
setTimeout(() => {
  useCrystalStore.getState().generateAtoms();
}, 0);
