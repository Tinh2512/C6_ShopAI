import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { CardProps, CardVariant } from '../../types';

export const Card: React.FC<CardProps> = ({
  variant  = 'default',
  children,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, shadows } = theme;

  const variantStyleMap: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
      borderWidth: 0,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderWidth: 0,
      ...shadows.lg,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
  };

  const containerStyle: ViewStyle[] = [
    {
      borderRadius: borderRadius.lg,
      padding: spacing[4],
    },
    variantStyleMap[variant],
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};