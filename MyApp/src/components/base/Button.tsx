import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';
import type { ButtonProps, ButtonVariant, ButtonSize } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  label,
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  loading  = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing } = theme;

  const sizeMap: Record<ButtonSize, {
    paddingVertical: number;
    paddingHorizontal: number;
    gap: number;
  }> = {
    sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], gap: spacing[1] },
    md: { paddingVertical: spacing[3], paddingHorizontal: spacing[5], gap: spacing[2] },
    lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[6], gap: spacing[2] },
  };

  const textSizeMap: Record<ButtonSize, 'sm' | 'base' | 'md'> = {
    sm: 'sm',
    md: 'base',
    lg: 'md',
  };

  const variantStyles: Record<ButtonVariant, {
    container: object;
    textColor: string;
    loaderColor: string;
  }> = {
    primary: {
      container: {
        backgroundColor: disabled ? colors.textDisabled : colors.primary,
        borderWidth: 0,
      },
      textColor:   colors.textInverse,
      loaderColor: colors.textInverse,
    },
    secondary: {
      container: {
        backgroundColor: disabled ? colors.textDisabled : colors.secondary,
        borderWidth: 0,
      },
      textColor:   colors.textInverse,
      loaderColor: colors.textInverse,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: disabled ? colors.textDisabled : colors.primary,
      },
      textColor:   disabled ? colors.textDisabled : colors.primary,
      loaderColor: colors.primary,
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      textColor:   disabled ? colors.textDisabled : colors.primary,
      loaderColor: colors.primary,
    },
  };

  const vs    = variantStyles[variant];
  const size_ = sizeMap[size];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        vs.container,
        {
          paddingVertical:   size_.paddingVertical,
          paddingHorizontal: size_.paddingHorizontal,
          borderRadius:      borderRadius.md,
          gap:               size_.gap,
          opacity:           disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.loaderColor} size="small" />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <DSText
            variant="label"
            weight="semibold"
            color={vs.textColor}
            style={{ fontSize: theme.typography.fontSize[textSizeMap[size]] }}
          >
            {label}
          </DSText>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },
});