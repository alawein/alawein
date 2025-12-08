/**
 * SimCore Unified Scientific Plotting System
 * 
 * Consolidates dual plotting standards into a single, research-grade configuration
 * that supports both dark/light themes with publication-quality output.
 * 
 * Replaces: unified-plot-config.ts + unified-plot-standards.ts
 * 
 * @author Dr. Meshal Alawein - UC Berkeley
 * @version 2.0.0 - Unified System
 */

import { Layout, Config, PlotData } from 'plotly.js';

// Theme-aware color system using CSS custom properties
export const SCIENTIFIC_COLORS = {
  // Primary physics colors (theme-aware)
  primary: 'hsl(var(--primary))',
  primaryGlow: 'hsl(var(--primary-glow))',
  accent: 'hsl(var(--accent))',
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted-foreground))',
  
  // Specialized physics domain colors
  physics: {
    valence: 'hsl(240 100% 65%)',      // Quantum blue
    conduction: 'hsl(0 84% 60%)',      // Research red  
    fermiLevel: 'hsl(45 93% 47%)',     // Academic gold
    dos: 'hsl(280 80% 60%)',           // Deep purple
    brillouinZone: 'hsl(210 40% 70%)', // Light gray
    diracPoint: 'hsl(45 93% 47%)',     // Gold for Dirac points
    
    // Thermal/magnetic colors
    hot: 'hsl(0 84% 60%)',             // Red
    cold: 'hsl(240 100% 65%)',         // Blue
    neutral: 'hsl(220 20% 50%)',       // Gray
    
    // Quantum states
    spinUp: 'hsl(120 60% 50%)',        // Green
    spinDown: 'hsl(0 84% 60%)',        // Red
    orbital: 'hsl(280 80% 60%)',       // Purple
  },
  
  // Background system (theme-aware)
  background: {
    plot: 'transparent',
    paper: 'transparent',
    legend: 'hsla(var(--card) / 0.95)',
    overlay: 'hsla(var(--background) / 0.8)',
  }
} as const;

// Professional line styles for scientific publications
export const SCIENTIFIC_LINE_STYLES = {
  // Band structure styling
  bands: {
    valence: { 
      color: SCIENTIFIC_COLORS.physics.valence, 
      width: 3, 
      dash: undefined 
    },
    conduction: { 
      color: SCIENTIFIC_COLORS.physics.conduction, 
      width: 3, 
      dash: undefined 
    },
    phonon: { 
      color: SCIENTIFIC_COLORS.physics.spinUp, 
      width: 3, 
      dash: undefined 
    },
    fermi: {
      color: SCIENTIFIC_COLORS.physics.fermiLevel,
      width: 2,
      dash: 'dash'
    }
  },
  
  // Density of states
  dos: {
    numerical: { 
      color: SCIENTIFIC_COLORS.physics.dos, 
      width: 3,
      dash: undefined
    },
    analytical: { 
      color: SCIENTIFIC_COLORS.physics.fermiLevel, 
      width: 2, 
      dash: 'dot' 
    },
    projected: {
      color: SCIENTIFIC_COLORS.accent,
      width: 2,
      dash: 'dashdot'
    }
  },
  
  // Brillouin zone paths
  brillouinZone: {
    boundary: { 
      color: SCIENTIFIC_COLORS.physics.brillouinZone, 
      width: 2 
    },
    highSymmetryPath: { 
      color: SCIENTIFIC_COLORS.physics.fermiLevel, 
      width: 4 
    },
    kPoints: { 
      color: SCIENTIFIC_COLORS.physics.diracPoint, 
      size: 12 
    }
  },
  
  // Time series and dynamics
  dynamics: {
    trajectory: {
      color: SCIENTIFIC_COLORS.primary,
      width: 2,
      dash: undefined
    },
    equilibrium: {
      color: SCIENTIFIC_COLORS.physics.neutral,
      width: 1,
      dash: 'dash'
    }
  }
} as const;

// Scientific typography system
export const SCIENTIFIC_TYPOGRAPHY = {
  // Font hierarchy
  fonts: {
    serif: "Computer Modern, 'STIX Two Text', 'Times New Roman', serif",
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  
  // Size scale for scientific content
  sizes: {
    title: 18,
    subtitle: 16,
    axis: 14,
    tick: 12,
    legend: 12,
    annotation: 11,
  },
  
  // Colors (theme-aware)
  colors: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--muted-foreground))',
    axis: 'hsl(var(--border))',
  }
} as const;

// Core scientific plot layout - publication ready
export const SCIENTIFIC_PLOT_CONFIG: Partial<Layout> = {
  // Background system
  plot_bgcolor: SCIENTIFIC_COLORS.background.plot,
  paper_bgcolor: SCIENTIFIC_COLORS.background.paper,
  
  // Typography
  font: {
    family: SCIENTIFIC_TYPOGRAPHY.fonts.serif,
    size: SCIENTIFIC_TYPOGRAPHY.sizes.axis,
    color: SCIENTIFIC_TYPOGRAPHY.colors.primary,
  },
  
  // Professional margins for axis labels and titles
  margin: { 
    l: 80,  // Left margin for y-axis labels with units
    r: 60,  // Right margin for legend space
    t: 70,  // Top margin for title
    b: 80,  // Bottom margin for x-axis labels with units
  },
  
  // Legend styling
  legend: {
    bgcolor: SCIENTIFIC_COLORS.background.legend,
    bordercolor: 'hsl(var(--border))',
    borderwidth: 1,
    font: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.legend,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary 
    },
    x: 1.02,
    y: 1,
    xanchor: 'left',
    yanchor: 'top',
  },
  
  // Default axis styling (scientific standard)
  xaxis: {
    showline: true,
    linewidth: 2,
    linecolor: 'hsl(var(--border))',
    tickcolor: 'hsl(var(--border))',
    tickwidth: 1.5,
    ticklen: 6,
    ticks: 'outside',
    mirror: 'allticks',
    showgrid: false,          // Publication standard: no grids
    zeroline: true,
    zerolinecolor: 'hsl(var(--muted-foreground))',
    zerolinewidth: 1,
    tickfont: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.tick,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary
    },
    titlefont: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.axis,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary
    },
    title: { standoff: 25 }
  },
  
  yaxis: {
    showline: true,
    linewidth: 2,
    linecolor: 'hsl(var(--border))',
    tickcolor: 'hsl(var(--border))',
    tickwidth: 1.5,
    ticklen: 6,
    ticks: 'outside',
    mirror: 'allticks',
    showgrid: false,          // Publication standard: no grids
    zeroline: true,
    zerolinecolor: 'hsl(var(--muted-foreground))',
    zerolinewidth: 1,
    tickfont: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.tick,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary
    },
    titlefont: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.axis,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary
    },
    title: { standoff: 35 }
  },
  
  // Hover styling
  hoverlabel: {
    bgcolor: SCIENTIFIC_COLORS.background.overlay,
    bordercolor: 'hsl(var(--border))',
    font: { 
      size: SCIENTIFIC_TYPOGRAPHY.sizes.annotation,
      color: SCIENTIFIC_TYPOGRAPHY.colors.primary
    }
  }
};

// Plotly configuration for scientific publishing
export const SCIENTIFIC_PLOT_CONTROLS: Partial<Config> = {
  displayModeBar: false,        // Remove UI controls for clean presentation
  doubleClick: 'reset+autosize',
  scrollZoom: true,
  responsive: true,
  displaylogo: false,
  
  // High-quality export options
  toImageButtonOptions: {
    format: 'svg',              // Vector format for publications
    filename: 'SimCore_plot',
    scale: 2,                   // High DPI for crisp rendering
    width: 800,
    height: 600,
  }
};

// Standardized physics axis labels with proper units and formatting
export const PHYSICS_AXIS_LABELS = {
  // Electronic structure
  energy: 'Energy [eV]',
  energyShift: 'Energy - E<sub>F</sub> [eV]',
  dos: 'Density of States [states/eV]',
  
  // Momentum space
  momentum: 'Crystal Momentum',
  kx: 'k<sub>x</sub> [2π/a]',
  ky: 'k<sub>y</sub> [2π/a]',
  kz: 'k<sub>z</sub> [2π/a]',
  wavevector: 'Wavevector [Å⁻¹]',
  
  // Real space
  position: 'Position [nm]',
  distance: 'Distance [Å]',
  latticeParam: 'Lattice Parameter [Å]',
  
  // Time and dynamics
  time: 'Time [fs]',
  timeLong: 'Time [ps]',
  frequency: 'Frequency [THz]',
  
  // Thermodynamics and statistical
  temperature: 'Temperature [K]',
  magnetization: 'Magnetization [μ<sub>B</sub>]',
  susceptibility: 'χ [emu/mol]',
  entropy: 'Entropy [k<sub>B</sub>]',
  heatCapacity: 'C<sub>V</sub> [k<sub>B</sub>]',
  
  // Quantum mechanics
  wavefunction: 'Wavefunction ψ',
  probability: 'Probability Density |ψ|²',
  phase: 'Phase [rad]',
  potential: 'Potential [eV]',
  
  // Fields and forces
  electricField: 'Electric Field [V/m]',
  magneticField: 'Magnetic Field [T]',
  force: 'Force [N]',
  
  // Dimensionless quantities
  correlation: 'Correlation Function g(r)',
  order: 'Order Parameter',
  coupling: 'Coupling Strength',
} as const;

// Energy ranges for different physics domains
export const PHYSICS_ENERGY_RANGES = {
  graphene: { min: -4, max: 4 },        // eV around Dirac point
  tmd: { min: -2, max: 3 },             // eV for TMD band gaps  
  semiconductor: { min: -6, max: 6 },    // eV wide gap materials
  metal: { min: -8, max: 8 },           // eV for metals
  phonon: { min: 0, max: 50 },          // THz for phonons
  general: { min: -10, max: 10 },       // eV general range
} as const;

/**
 * Create standardized scientific plot layout
 */
export function createScientificPlotLayout(
  title: string,
  xLabel: string,
  yLabel: string,
  options?: {
    energyRange?: { min: number; max: number };
    showLegend?: boolean;
    height?: number;
    customMargins?: Partial<Layout['margin']>;
  }
): Partial<Layout> {
  const { energyRange, showLegend = true, height = 450, customMargins } = options || {};
  
  return {
    ...SCIENTIFIC_PLOT_CONFIG,
    
    title: {
      text: title,
      font: {
        size: SCIENTIFIC_TYPOGRAPHY.sizes.title,
        family: SCIENTIFIC_TYPOGRAPHY.fonts.serif,
        color: SCIENTIFIC_TYPOGRAPHY.colors.primary,
      },
      x: 0.5,
      xanchor: 'center' as const,
      pad: { t: 20 }
    },
    
    xaxis: {
      ...SCIENTIFIC_PLOT_CONFIG.xaxis,
      title: { 
        text: xLabel,
        standoff: 25
      },
    },
    
    yaxis: {
      ...SCIENTIFIC_PLOT_CONFIG.yaxis,
      title: { 
        text: yLabel,
        standoff: 35
      },
      ...(energyRange && { range: [energyRange.min, energyRange.max] })
    },
    
    showlegend: showLegend,
    height,
    
    ...(customMargins && {
      margin: { ...SCIENTIFIC_PLOT_CONFIG.margin, ...customMargins }
    }),
    
    hovermode: 'closest' as const,
  };
}

/**
 * Create standardized scientific plot data trace
 */
export function createScientificPlotTrace(
  x: number[],
  y: number[],
  name: string,
  traceType: 'line' | 'scatter' | 'markers' = 'line',
  style?: {
    color?: string;
    width?: number;
    dash?: string;
    size?: number;
  }
): Partial<PlotData> {
  const { color, width = 2, dash, size = 8 } = style || {};
  
  const baseTrace: Partial<PlotData> = {
    x,
    y,
    name,
    type: 'scatter',
    hovertemplate: `${name}<br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`,
  };
  
  switch (traceType) {
    case 'line':
      return {
        ...baseTrace,
        mode: 'lines',
        line: {
          color: color || SCIENTIFIC_COLORS.primary,
          width,
          dash: dash as any,
        }
      };
      
    case 'scatter':
      return {
        ...baseTrace,
        mode: 'lines+markers',
        line: {
          color: color || SCIENTIFIC_COLORS.primary,
          width: width * 0.7,
          dash: dash as any,
        },
        marker: {
          color: color || SCIENTIFIC_COLORS.primary,
          size: size * 0.8,
          line: {
            width: 1,
            color: 'hsl(var(--background))'
          }
        }
      };
      
    case 'markers':
      return {
        ...baseTrace,
        mode: 'markers',
        marker: {
          color: color || SCIENTIFIC_COLORS.primary,
          size,
          line: {
            width: 2,
            color: 'hsl(var(--background))'
          }
        }
      };
      
    default:
      return baseTrace;
  }
}

/**
 * Create band structure plot trace with scientific styling
 */
export function createBandStructureTrace(
  kPath: number[],
  energies: number[],
  bandType: 'valence' | 'conduction' | 'phonon',
  name?: string
): Partial<PlotData> {
  const style = SCIENTIFIC_LINE_STYLES.bands[bandType];
  const displayName = name || `${bandType.charAt(0).toUpperCase()}${bandType.slice(1)} Band`;
  
  return createScientificPlotTrace(
    kPath,
    energies,
    displayName,
    'line',
    style
  );
}

/**
 * Create DOS plot trace with scientific styling
 */
export function createDOSTrace(
  energies: number[],
  dos: number[],
  dosType: 'numerical' | 'analytical' | 'projected',
  name?: string
): Partial<PlotData> {
  const style = SCIENTIFIC_LINE_STYLES.dos[dosType];
  const displayName = name || `${dosType.charAt(0).toUpperCase()}${dosType.slice(1)} DOS`;
  
  return createScientificPlotTrace(
    dos,           // DOS on x-axis (standard convention)
    energies,      // Energy on y-axis  
    displayName,
    'line',
    style
  );
}

/**
 * Add Fermi level reference line
 */
export function createFermiLevelTrace(
  xRange: [number, number],
  fermiEnergy: number = 0,
  name: string = 'Fermi Level'
): Partial<PlotData> {
  return createScientificPlotTrace(
    xRange,
    [fermiEnergy, fermiEnergy],
    name,
    'line',
    SCIENTIFIC_LINE_STYLES.bands.fermi
  );
}

// Export unified configuration (replaces both old systems)
export const UNIFIED_SCIENTIFIC_PLOT_SYSTEM = {
  layout: SCIENTIFIC_PLOT_CONFIG,
  config: SCIENTIFIC_PLOT_CONTROLS,
  colors: SCIENTIFIC_COLORS,
  lineStyles: SCIENTIFIC_LINE_STYLES,
  typography: SCIENTIFIC_TYPOGRAPHY,
  axisLabels: PHYSICS_AXIS_LABELS,
  energyRanges: PHYSICS_ENERGY_RANGES,
  
  // Helper functions
  createLayout: createScientificPlotLayout,
  createTrace: createScientificPlotTrace,
  createBandTrace: createBandStructureTrace,
  createDOSTrace,
  createFermiTrace: createFermiLevelTrace,
} as const;

// Legacy compatibility (to be deprecated)
export { UNIFIED_SCIENTIFIC_PLOT_SYSTEM as SIMCORE_PLOT_CONFIG };
export { UNIFIED_SCIENTIFIC_PLOT_SYSTEM as GRAPHENE_PLOT_THEME };