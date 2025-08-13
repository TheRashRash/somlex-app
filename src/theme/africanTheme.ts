// African (Eastern) Theme System for Somlex App
// Inspired by East African culture, nature, and traditional aesthetics

export const AfricanColors = {
  // Primary colors inspired by East African landscapes
  primary: {
    // Inspired by golden savanna and sunrise
    main: '#D4AF37', // Golden
    light: '#F4D03F', // Light gold
    dark: '#B7950B', // Deep gold
    contrast: '#FFFFFF',
  },
  
  // Secondary colors from East African nature
  secondary: {
    // Inspired by acacia trees and rich earth
    main: '#8B4513', // Saddle brown
    light: '#CD853F', // Sandy brown  
    dark: '#654321', // Dark brown
    contrast: '#FFFFFF',
  },
  
  // Accent colors from traditional textiles and nature
  accent: {
    terracotta: '#D2691E', // Traditional pottery
    coral: '#FF7F50', // Red Sea coral
    turquoise: '#40E0D0', // Indian Ocean
    ochre: '#CC7722', // African earth pigment
    indigo: '#4B0082', // Traditional dye
    emerald: '#50C878', // Ethiopian highlands
  },
  
  // Neutral colors inspired by natural materials
  neutral: {
    white: '#FFFEF7', // Warm white like ivory
    lightGray: '#F5F5DC', // Beige like sand
    mediumGray: '#D2B48C', // Tan like desert
    darkGray: '#8B7355', // Khaki like dried grass
    charcoal: '#36454F', // Dark slate
    black: '#2F2F2F', // Soft black
  },
  
  // Semantic colors
  semantic: {
    success: '#228B22', // Forest green
    warning: '#FF8C00', // Dark orange
    error: '#DC143C', // Crimson
    info: '#4682B4', // Steel blue
    
    // Learning-specific colors
    beginner: '#32CD32', // Lime green
    intermediate: '#FFD700', // Gold
    advanced: '#FF6347', // Tomato
  },
  
  // Background colors
  background: {
    primary: '#FFFEF7', // Warm white
    secondary: '#F5F5DC', // Light beige
    card: '#FFFFFF',
    surface: '#FAF0E6', // Linen
    overlay: 'rgba(47, 47, 47, 0.8)',
  },
  
  // Text colors
  text: {
    primary: '#2F2F2F', // Soft black
    secondary: '#654321', // Dark brown
    tertiary: '#8B7355', // Medium brown
    accent: '#D4AF37', // Gold
    inverse: '#FFFEF7', // Warm white
    muted: '#A0A0A0',
  },
};

export const AfricanTypography = {
  // Font families with fallbacks
  fontFamily: {
    // For Somali text - clean, readable
    primary: 'System', // Will use system font for now
    // For headings - more decorative
    heading: 'System',
    // For body text
    body: 'System',
    // Monospace for code/technical
    mono: 'Courier New',
  },
  
  // Font sizes following a harmonious scale
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 64,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line heights for readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

export const AfricanSpacing = {
  // Spacing scale based on 8px grid
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

export const AfricanBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const AfricanShadows = {
  none: 'none',
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

// Pattern definitions inspired by African textiles
export const AfricanPatterns = {
  // Geometric patterns common in East African art
  kente: {
    colors: [AfricanColors.primary.main, AfricanColors.secondary.main, AfricanColors.accent.coral],
    pattern: 'geometric',
  },
  mudcloth: {
    colors: [AfricanColors.neutral.charcoal, AfricanColors.neutral.lightGray],
    pattern: 'organic',
  },
  dashiki: {
    colors: [AfricanColors.accent.turquoise, AfricanColors.primary.main, AfricanColors.accent.coral],
    pattern: 'circular',
  },
};

// Complete theme object
export const AfricanTheme = {
  colors: AfricanColors,
  typography: AfricanTypography,
  spacing: AfricanSpacing,
  borderRadius: AfricanBorderRadius,
  shadows: AfricanShadows,
  patterns: AfricanPatterns,
};

export default AfricanTheme;
