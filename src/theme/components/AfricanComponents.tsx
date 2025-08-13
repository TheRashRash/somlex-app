import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AfricanColors, AfricanSpacing, AfricanBorderRadius, AfricanShadows } from '../africanTheme';

// African pattern background component
export const AfricanPatternBackground: React.FC<{
  pattern?: 'kente' | 'mudcloth' | 'dashiki' | 'geometric';
  opacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}> = ({ pattern = 'geometric', opacity = 0.1, style, children }) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'kente':
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.kenteStripe,
                  {
                    backgroundColor: i % 3 === 0 ? AfricanColors.primary.main : 
                                   i % 3 === 1 ? AfricanColors.secondary.main : 
                                   AfricanColors.accent.coral,
                    transform: [{ rotate: '45deg' }],
                    left: i * 20,
                  },
                ]}
              />
            ))}
          </View>
        );
      case 'geometric':
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.geometricShape,
                  {
                    backgroundColor: i % 2 === 0 ? AfricanColors.primary.light : AfricanColors.accent.terracotta,
                    left: (i % 4) * 80,
                    top: Math.floor(i / 4) * 80,
                  },
                ]}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.backgroundContainer, style]}>
      {renderPattern()}
      {children}
    </View>
  );
};

// Gradient background component
export const AfricanGradient: React.FC<{
  variant?: 'sunrise' | 'sunset' | 'earth' | 'ocean';
  style?: ViewStyle;
  children?: React.ReactNode;
}> = ({ variant = 'sunrise', style, children }) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'sunrise':
        return [AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main];
      case 'sunset':
        return [AfricanColors.accent.coral, AfricanColors.primary.main, AfricanColors.secondary.dark];
      case 'earth':
        return [AfricanColors.neutral.lightGray, AfricanColors.neutral.mediumGray, AfricanColors.secondary.main];
      case 'ocean':
        return [AfricanColors.accent.turquoise, AfricanColors.semantic.info, AfricanColors.accent.indigo];
      default:
        return [AfricanColors.primary.light, AfricanColors.primary.main];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.gradientContainer, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

// Decorative African border component
export const AfricanBorder: React.FC<{
  variant?: 'top' | 'bottom' | 'full';
  pattern?: 'zigzag' | 'diamonds' | 'waves';
  color?: string;
  style?: ViewStyle;
}> = ({ variant = 'full', pattern = 'zigzag', color = AfricanColors.primary.main, style }) => {
  const renderZigzagPattern = () => (
    <View style={[styles.zigzagContainer, style]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.zigzagElement,
            { backgroundColor: color, left: i * 30 }
          ]}
        />
      ))}
    </View>
  );

  const renderDiamondPattern = () => (
    <View style={[styles.diamondContainer, style]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.diamondElement,
            { 
              backgroundColor: color, 
              left: i * 40,
              transform: [{ rotate: '45deg' }]
            }
          ]}
        />
      ))}
    </View>
  );

  const renderPattern = () => {
    switch (pattern) {
      case 'diamonds':
        return renderDiamondPattern();
      case 'zigzag':
      default:
        return renderZigzagPattern();
    }
  };

  return (
    <View style={[
      styles.borderContainer,
      variant === 'top' && styles.borderTop,
      variant === 'bottom' && styles.borderBottom,
    ]}>
      {renderPattern()}
    </View>
  );
};

// African-styled card component
export const AfricanCard: React.FC<{
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  pattern?: boolean;
  style?: ViewStyle;
}> = ({ children, variant = 'elevated', pattern = false, style }) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: AfricanColors.background.card,
          borderWidth: 2,
          borderColor: AfricanColors.primary.main,
        };
      case 'filled':
        return {
          backgroundColor: AfricanColors.primary.light,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: AfricanColors.background.card,
          ...AfricanShadows.md,
        };
    }
  };

  return (
    <View style={[
      styles.card,
      getCardStyle(),
      style
    ]}>
      {pattern && (
        <AfricanPatternBackground pattern="geometric" opacity={0.05} />
      )}
      {children}
    </View>
  );
};

// African-themed button component
export const AfricanButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}> = ({ children, variant = 'primary', size = 'medium', onPress, style, disabled = false }) => {
  const getButtonColors = () => {
    if (disabled) {
      return {
        backgroundColor: AfricanColors.neutral.mediumGray,
        borderColor: AfricanColors.neutral.darkGray,
      };
    }
    
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: AfricanColors.secondary.main,
          borderColor: AfricanColors.secondary.dark,
        };
      case 'accent':
        return {
          backgroundColor: AfricanColors.accent.terracotta,
          borderColor: AfricanColors.accent.ochre,
        };
      case 'primary':
      default:
        return {
          backgroundColor: AfricanColors.primary.main,
          borderColor: AfricanColors.primary.dark,
        };
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: AfricanSpacing.sm, paddingVertical: AfricanSpacing.xs };
      case 'large':
        return { paddingHorizontal: AfricanSpacing.xl, paddingVertical: AfricanSpacing.md };
      case 'medium':
      default:
        return { paddingHorizontal: AfricanSpacing.lg, paddingVertical: AfricanSpacing.sm };
    }
  };

  return (
    <View 
      style={[
        styles.button,
        getButtonColors(),
        getButtonSize(),
        style,
        disabled && styles.buttonDisabled
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Pattern backgrounds
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  kenteStripe: {
    position: 'absolute',
    width: 8,
    height: '200%',
    top: -50,
  },
  geometricShape: {
    position: 'absolute',
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
  },
  
  // Backgrounds
  backgroundContainer: {
    position: 'relative',
  },
  gradientContainer: {
    flex: 1,
  },
  
  // Borders
  borderContainer: {
    height: 8,
    overflow: 'hidden',
  },
  borderTop: {
    marginBottom: AfricanSpacing.sm,
  },
  borderBottom: {
    marginTop: AfricanSpacing.sm,
  },
  zigzagContainer: {
    flexDirection: 'row',
    height: 8,
  },
  zigzagElement: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  diamondContainer: {
    flexDirection: 'row',
    height: 8,
    alignItems: 'center',
  },
  diamondElement: {
    position: 'absolute',
    width: 6,
    height: 6,
  },
  
  // Cards
  card: {
    borderRadius: AfricanBorderRadius.lg,
    padding: AfricanSpacing.md,
    marginVertical: AfricanSpacing.sm,
  },
  
  // Buttons
  button: {
    borderRadius: AfricanBorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...AfricanShadows.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default {
  AfricanPatternBackground,
  AfricanGradient,
  AfricanBorder,
  AfricanCard,
  AfricanButton,
};
