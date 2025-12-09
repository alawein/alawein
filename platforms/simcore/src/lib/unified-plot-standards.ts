/**
 * Unified Scientific Plotting Standards for SimCore
 * Publication-quality plots with no UI overlays and research-grade styling
 */

import { Layout, Config, PlotData } from 'plotly.js';

// Core plotting standards - NO GRIDS, publication quality
export const UNIFIED_PLOT_STANDARDS = {
  layout: {
    font: { 
      family: "Computer Modern, Times, serif", 
      size: 14,
      color: '#1a1a1a'  // Dark text for readability
    },
    showgrid: false,                    // CRITICAL: No grid lines for publication quality
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    margin: {
      l: 80,  // Increased for proper axis labels with units
      r: 60,
      b: 80,  // Increased for proper axis labels
      t: 60
    },
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#374151',
      borderwidth: 1,
      font: { size: 12, color: '#1a1a1a' }
    }
  },
  config: {
    displayModeBar: false,              // Remove ALL UI overlays
    doubleClick: 'reset+autosize',
    scrollZoom: true,
    responsive: true,
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'plot',
      height: 600,
      width: 800,
      scale: 2
    }
  }
} as const;

// Scientific axis styling - no grids, professional appearance
export const SCIENTIFIC_AXIS_STYLE = {
  showline: true,
  linewidth: 2,
  linecolor: '#374151',
  tickcolor: '#374151',
  ticklen: 6,
  tickfont: { size: 12, color: '#1a1a1a' },
  titlefont: { size: 14, color: '#1a1a1a', standoff: 20 },
  showgrid: false,        // CRITICAL: No grid lines
  zeroline: true,
  zerolinecolor: '#6b7280',
  zerolinewidth: 2,
  mirror: 'allticks',     // Show ticks on both sides (scientific standard)
  ticks: 'outside'
} as const;

// Color schemes for different physics domains
export const PHYSICS_COLOR_SCHEMES = {
  bandStructure: {
    valence: '#2563eb',     // blue
    conduction: '#dc2626',  // red
    brillouinZone: '#6b7280', // gray
    highSymmetry: '#059669', // green
    fermiLevel: '#d97706',   // orange
    dos: '#7c3aed',         // purple
    diracPoint: '#ca8a04'   // yellow/gold for Dirac points
  },
  quantum: {
    wavefunction: '#2563eb',
    probability: '#dc2626',
    potential: '#059669',
    energy: '#d97706',
    phase: '#7c3aed'
  },
  statistical: {
    temperature: '#dc2626',
    entropy: '#2563eb',
    magnetization: '#059669',
    correlation: '#d97706',
    distribution: '#7c3aed'
  }
} as const;

// Scientific colorscales - perceptually uniform and colorblind accessible
export const SCIENTIFIC_COLORMAPS = {
  energy: 'Viridis',        // Energy surfaces (perceptually uniform)
  density: 'Plasma',        // DOS, charge density
  phase: 'Twilight',        // Phase information
  diverging: 'RdBu',        // Symmetric about zero
  valence: 'Blues',         // Valence band specific
  conduction: 'Reds'        // Conduction band specific
} as const;

// Standardized axis labels with proper units
export const PHYSICS_AXIS_LABELS = {
  // Band structure
  energy: 'Energy [eV]',
  wavevector: 'Wavevector [Å⁻¹]', 
  momentum: 'Crystal Momentum [2π/a]',
  dos: 'Density of States [states/eV]',
  kx: 'k_x [Å⁻¹]',
  ky: 'k_y [Å⁻¹]',
  kz: 'k_z [Å⁻¹]',
  
  // Quantum mechanics
  position: 'Position [nm]',
  time: 'Time [fs]',
  probability: 'Probability Density',
  wavefunction: 'Wavefunction ψ',
  potential: 'Potential [eV]',
  
  // Statistical physics
  temperature: 'Temperature [K]',
  magnetization: 'Magnetization [μ_B]',
  susceptibility: 'Susceptibility [emu/mol]',
  entropy: 'Entropy [k_B]',
  correlation: 'Correlation Function'
} as const;

/**
 * Generate standardized plot layout for physics modules
 */
export function createPhysicsPlotLayout(
  title: string,
  xLabel: string,
  yLabel: string,
  zLabel?: string,
  colorScheme: keyof typeof PHYSICS_COLOR_SCHEMES = 'bandStructure'
): Partial<Layout> {
  return {
    ...UNIFIED_PLOT_STANDARDS.layout,
    title: {
      text: title,
      font: { size: 16, family: "Computer Modern, Times, serif" },
      x: 0.5,
      xanchor: 'center'
    },
    xaxis: {
      ...SCIENTIFIC_AXIS_STYLE,
      title: { text: xLabel }
    },
    yaxis: {
      ...SCIENTIFIC_AXIS_STYLE,
      title: { text: yLabel }
    },
    ...(zLabel && {
      scene: {
        xaxis: { ...SCIENTIFIC_AXIS_STYLE, title: { text: xLabel } },
        yaxis: { ...SCIENTIFIC_AXIS_STYLE, title: { text: yLabel } },
        zaxis: { ...SCIENTIFIC_AXIS_STYLE, title: { text: zLabel } }
      }
    })
  };
}

/**
 * Create standardized plot data with proper styling
 */
export function createPhysicsPlotData(
  x: number[],
  y: number[],
  name: string,
  plotType: 'scatter' | 'line' | 'surface' = 'line',
  color?: string
): Partial<PlotData> {
  const baseData: Partial<PlotData> = {
    x,
    y,
    name,
    type: plotType === 'line' ? 'scatter' : plotType,
    ...(plotType === 'line' && {
      mode: 'lines',
      line: { 
        width: 2,
        color: color || PHYSICS_COLOR_SCHEMES.bandStructure.valence
      }
    }),
    ...(plotType === 'scatter' && {
      mode: 'markers',
      marker: { 
        size: 6,
        color: color || PHYSICS_COLOR_SCHEMES.bandStructure.highSymmetry
      }
    })
  };

  return baseData;
}

/**
 * Export ready-to-use config for all physics plots
 */
export const PHYSICS_PLOT_CONFIG: Partial<Config> = {
  ...UNIFIED_PLOT_STANDARDS.config,
  // Additional physics-specific configuration
  doubleClick: 'reset+autosize',
  scrollZoom: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'physics_plot',
    height: 600,
    width: 800,
    scale: 2
  }
};

// Backward compatibility with existing modules
export { UNIFIED_PLOT_STANDARDS as GRAPHENE_PLOT_THEME };
export { SCIENTIFIC_AXIS_STYLE as AXIS_STYLE };
export { SCIENTIFIC_COLORMAPS as SURFACE_COLORS };
export { PHYSICS_AXIS_LABELS as AXIS_LABELS };