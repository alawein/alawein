// Nexus UI Theme
export default {
  // Color palette
  colors: {
    primary: {
      10: '#f3f0ff',
      20: '#e4dfff',
      30: '#d1c7ff',
      40: '#b8a9ff',
      50: '#9f86ff',
      60: '#8468ff',
      70: '#6b46ff',
      80: '#5b21b6',
      90: '#4c1d95',
      100: '#2e1065',
    },
    secondary: {
      10: '#f0fdfa',
      20: '#ccfbf1',
      30: '#99f6e4',
      40: '#5eead4',
      50: '#2dd4bf',
      60: '#14b8a6',
      70: '#0d9488',
      80: '#0f766e',
      90: '#115e59',
      100: '#134e4a',
    },
    neutral: {
      10: '#fafafa',
      20: '#f5f5f5',
      30: '#e5e5e5',
      40: '#d4d4d4',
      50: '#a3a3a3',
      60: '#737373',
      70: '#525252',
      80: '#404040',
      90: '#262626',
      100: '#171717',
    },
    error: {
      10: '#fef2f2',
      20: '#fee2e2',
      30: '#fecaca',
      40: '#fca5a5',
      50: '#f87171',
      60: '#ef4444',
      70: '#dc2626',
      80: '#b91c1c',
      90: '#991b1b',
      100: '#7f1d1d',
    },
    warning: {
      10: '#fffbeb',
      20: '#fef3c7',
      30: '#fde68a',
      40: '#fcd34d',
      50: '#fbbf24',
      60: '#f59e0b',
      70: '#d97706',
      80: '#b45309',
      90: '#92400e',
      100: '#78350f',
    },
    success: {
      10: '#f0fdf4',
      20: '#dcfce7',
      30: '#bbf7d0',
      40: '#86efac',
      50: '#4ade80',
      60: '#22c55e',
      70: '#16a34a',
      80: '#15803d',
      90: '#166534',
      100: '#14532d',
    },
  },

  // Typography
  font: {
    family: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    weight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Components
  components: {
    button: {
      primary: {
        backgroundColor: '#5b21b6',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: '#6b46ff',
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#5b21b6',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: '1px solid #5b21b6',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: '#5b21b6',
          color: 'white',
        },
      },
    },
    input: {
      base: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #d4d4d4',
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        '&:focus': {
          outline: 'none',
          borderColor: '#5b21b6',
          boxShadow: '0 0 0 3px rgba(91, 33, 182, 0.1)',
        },
      },
    },
    card: {
      base: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
};
