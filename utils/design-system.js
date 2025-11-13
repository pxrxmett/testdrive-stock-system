/**
 * Design System Constants
 * Centralized design tokens for consistent UX/UI across the application
 */

// BRAND COLORS
export const COLORS = {
  // Isuzu Brand (Primary)
  isuzu: {
    primary: '#D52B1E',      // Isuzu Red
    secondary: '#1a1a1a',    // Black
    light: '#FEE2E2',        // Light Red bg-red-100
    hover: '#B91C1C',        // Darker Red bg-red-700
    focus: '#DC2626'         // Focus Red bg-red-600
  },

  // BYD Brand (Secondary Brand)
  byd: {
    primary: '#00A4E4',      // BYD Blue
    secondary: '#00A651',    // BYD Green
    light: '#DBEAFE',        // Light Blue
    hover: '#0284C7',        // Darker Blue
    focus: '#0EA5E9'         // Focus Blue
  },

  // Status Colors
  status: {
    success: '#10B981',      // Green-600
    warning: '#F59E0B',      // Yellow-600
    error: '#EF4444',        // Red-500
    info: '#3B82F6'          // Blue-500
  },

  // Grayscale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6'
  }
}

// TYPOGRAPHY
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    sans: 'Sarabun, Prompt, system-ui, sans-serif',
    thai: 'Sarabun, Prompt, sans-serif'
  },

  // Font Sizes
  fontSize: {
    xs: '12px',      // Small text, captions
    sm: '13px',      // Secondary text
    base: '14px',    // Body text (default)
    md: '16px',      // Emphasized text
    lg: '18px',      // Section titles
    xl: '20px',      // Sub-headings
    '2xl': '24px',   // Page titles
    '3xl': '30px',   // Hero text
    '4xl': '36px'    // Display text
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
}

// SPACING (4px grid system)
export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px'
}

// COMPONENT SIZES
export const SIZES = {
  // Buttons
  button: {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: '13px'
    },
    md: {
      height: '40px',
      padding: '0 16px',
      fontSize: '14px'
    },
    lg: {
      height: '48px',
      padding: '0 24px',
      fontSize: '16px'
    }
  },

  // Inputs
  input: {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: '13px'
    },
    md: {
      height: '40px',
      padding: '0 12px',
      fontSize: '14px'
    },
    lg: {
      height: '48px',
      padding: '0 16px',
      fontSize: '16px'
    }
  },

  // Icons
  icon: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  },

  // Avatars
  avatar: {
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px'
  }
}

// BORDER RADIUS
export const RADIUS = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px'
}

// SHADOWS
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
}

// TRANSITIONS
export const TRANSITIONS = {
  fast: '100ms ease',
  default: '150ms ease',
  slow: '300ms ease',

  // Common transitions
  all: 'all 150ms ease',
  colors: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
  transform: 'transform 150ms ease',
  opacity: 'opacity 150ms ease'
}

// Z-INDEX LAYERS
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
}

// BREAKPOINTS
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// HELPER FUNCTIONS
export const getColor = (path) => {
  const keys = path.split('.')
  let value = COLORS
  for (const key of keys) {
    value = value[key]
    if (!value) return null
  }
  return value
}

export const getSpacing = (size) => SPACING[size] || size

export const getRadius = (size) => RADIUS[size] || size

export const getShadow = (size) => SHADOWS[size] || SHADOWS.default

// Export all as default object
export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SIZES,
  RADIUS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  BREAKPOINTS,
  getColor,
  getSpacing,
  getRadius,
  getShadow
}
