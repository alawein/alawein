/**
 * SimCore Unified Plot Configuration
 * 
 * This file provides standardized styling for all scientific plots across SimCore,
 * ensuring publication-quality visuals with consistent dark theme integration.
 */

// Accessibility-aware helpers and CSS-variable driven colors
const isHighContrastEnabled = () => typeof document !== 'undefined' && document.documentElement.classList.contains('high-contrast');
const PLOT_COLORS = {
  text: 'hsl(var(--plot-fg))',
  axis: 'hsl(var(--plot-axis))',
  zero: 'hsl(var(--plot-axis-zero))',
  legendBg: 'hsl(var(--plot-legend-bg) / 0.3)',
  legendBorder: 'hsl(var(--border))'
};

// Core Plot Configuration - Applied to ALL plots
export const SIMCORE_PLOT_CONFIG = {
  layout: {
    // CRITICAL: Remove white backgrounds for dark theme consistency
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    
    // Professional serif typography
    font: {
      family: "Computer Modern, 'Times New Roman', serif",
      size: 14,
      color: PLOT_COLORS.text
    },
    
    // Axes styling - NO GRIDS for publication quality
    xaxis: {
      showgrid: false,           // MANDATORY: Remove all grids
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: PLOT_COLORS.zero,
      linewidth: 2,
      linecolor: PLOT_COLORS.axis,
      mirror: 'allticks',
      ticks: 'outside',
      tickwidth: 1.5,
      ticklen: 8,
      showline: true,
      tickcolor: PLOT_COLORS.axis,
      title: {
        font: { size: 16, family: "Computer Modern, serif", color: PLOT_COLORS.text },
        standoff: 25
      }
    },
    
    yaxis: {
      showgrid: false,           // MANDATORY: Remove all grids
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: PLOT_COLORS.zero,
      linewidth: 2,
      linecolor: PLOT_COLORS.axis,
      mirror: 'allticks',
      ticks: 'outside',
      tickwidth: 1.5,
      ticklen: 8,
      showline: true,
      tickcolor: PLOT_COLORS.axis,
      title: {
        font: { size: 16, family: "Computer Modern, serif", color: PLOT_COLORS.text },
        standoff: 35
      }
    },
    
    // Proper margins for scientific plots
    margin: { t: 60, r: 50, b: 80, l: 90 },
    
    // Legend styling
    legend: {
      bgcolor: PLOT_COLORS.legendBg,
      bordercolor: PLOT_COLORS.legendBorder,
      borderwidth: 1,
      font: { color: PLOT_COLORS.text }
    }
  },
  
  config: {
    displayModeBar: false,        // MANDATORY: Remove ALL overlay controls
    doubleClick: 'reset+autosize',
    scrollZoom: true,
    responsive: true,
    toImageButtonOptions: {
      format: 'svg',
      filename: 'SimCore_plot',
      scale: 1
    }
  }
};

// Energy range standardization for different physics domains
export const ENERGY_RANGES = {
  graphene: { min: -4, max: 4 },      // eV - User specification
  phonon: { min: 0, max: 50 },        // THz
  general: { min: -6, max: 6 }        // eV
};

// Professional line styling standards - THICK LINES for visibility
export const LINE_STYLES = {
  bands: {
    valence: { color: 'hsl(var(--physics-valence))', width: 3 },     // Theme blue, thick
    conduction: { color: 'hsl(var(--physics-conduction))', width: 3 },  // Theme red, thick
    phonon: { color: 'hsl(var(--semantic-domain-statistical))', width: 3 }       // Theme green, thick
  },
  
  dos: {
    numerical: { color: 'hsl(var(--physics-dos))', width: 3 },   // Theme purple, thick
    analytical: { color: 'hsl(var(--primitive-gold-500))', width: 2, dash: 'dash' } // Theme gold, dashed
  },
  
  bz: {
    boundary: { color: 'hsl(var(--muted-foreground))', width: 3 },    // Theme light gray, thick
    path: { color: 'hsl(var(--primitive-gold-500))', width: 4 },        // Theme gold, very thick
    points: { color: 'hsl(var(--destructive))', size: 12 }       // Theme red markers, large
  },
  
  fermiLevel: {
    color: 'hsl(var(--physics-fermi))',
    width: 2,
    dash: 'dash'
  }
};

// Standardized axis labels with proper units
export const AXIS_LABELS = {
  energy: 'Energy [eV]',
  frequency: 'Frequency [THz]',
  dos: 'DOS [states/eV]',
  kx: 'k<sub>x</sub> [2π/a]',
  ky: 'k<sub>y</sub> [2π/a]',
  momentum: 'Crystal Momentum',
  temperature: 'Temperature [K]',
  time: 'Time [fs]'
};

// Color schemes for different physics domains
export const COLOR_SCHEMES = {
  bandStructure: {
    valence: 'hsl(var(--physics-valence))',      // Blue
    conduction: 'hsl(var(--physics-conduction))',   // Red
    fermiLevel: 'hsl(var(--physics-fermi))',   // Gold/gray
    dos: 'hsl(var(--physics-dos))'           // Purple
  },
  
  brillouinZone: {
    boundary: 'hsl(var(--muted-foreground))',     // Light gray
    path: 'hsl(var(--primitive-gold-500))',         // Gold
    highSymmetry: 'hsl(var(--destructive))', // Red
    ibz: 'hsl(var(--semantic-domain-statistical))'           // Green
  },
  
  thermal: {
    hot: 'hsl(var(--destructive))',          // Red
    cold: 'hsl(var(--physics-valence))',         // Blue
    neutral: 'hsl(var(--physics-neutral))'       // Gray
  }
};

// Helper function to create standardized plot layout
export const createPhysicsPlotLayout = (
  title: string,
  xLabel: string,
  yLabel: string,
  energyRange?: { min: number; max: number }
): any => {
  const hc = isHighContrastEnabled();
  const axisOverrides = hc ? { tickwidth: 2, ticklen: 10, linewidth: 2.5 } : {};
  return {
    ...SIMCORE_PLOT_CONFIG.layout,
    font: {
      ...(SIMCORE_PLOT_CONFIG.layout as any).font,
      size: hc ? 16 : 14,
      color: PLOT_COLORS.text
    },
    title: {
      text: title,
      font: { size: hc ? 18 : 16, family: "Computer Modern, serif", color: PLOT_COLORS.text }
    },
    xaxis: {
      ...SIMCORE_PLOT_CONFIG.layout.xaxis,
      ...axisOverrides,
      title: xLabel
    },
    yaxis: {
      ...SIMCORE_PLOT_CONFIG.layout.yaxis,
      ...axisOverrides,
      title: yLabel,
      ...(energyRange && { range: [energyRange.min, energyRange.max] })
    },
    margin: { l: 60, r: 40, t: 60, b: 50 },
    height: 400,
    hovermode: 'closest' as const
  };
};

// Helper function to create standardized plot data
export const createBandPlotData = (
  kPath: number[],
  energies: number[],
  name: string,
  lineStyle: any
) => {
  const hc = isHighContrastEnabled();
  const line = lineStyle ? { ...lineStyle, ...(hc ? { width: (lineStyle.width ?? 2) + 1.5 } : {}) } : lineStyle;
  return {
    x: kPath,
    y: energies,
    type: 'scatter' as const,
    mode: 'lines' as const,
    name,
    line,
    hovertemplate: `${name}<br>k: %{x:.3f}<br>E: %{y:.3f} eV<extra></extra>`
  };
};