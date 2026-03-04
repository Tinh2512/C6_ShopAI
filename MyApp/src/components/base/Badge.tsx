import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';
import type { BadgeProps, BadgeVariant, BadgeSize } from '../../types';

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size    = 'md',
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing } = theme;

  const variantColorMap: Record<BadgeVariant, { bg: string; text: string }> = {
    default: { bg: colors.surfaceVariant, text: colors.textSecondary },
    success: { bg: colors.successLight,   text: colors.success },
    error:   { bg: colors.errorLight,     text: colors.error },
    warning: { bg: colors.warningLight,   text: colors.warning },
    info:    { bg: colors.infoLight,      text: colors.info },
  };

  const sizeMap: Record<BadgeSize, { px: number; py: number; fontSize: number }> = {
    sm: { px: spacing[2], py: spacing[1] - 2, fontSize: 10 },
    md: { px: spacing[3], py: spacing[1],      fontSize: 12 },
  };

  const vc = variantColorMap[variant];
  const sz = sizeMap[size];

  return (
    <View
      style={[
        {
          alignSelf:         'flex-start',
          backgroundColor:   vc.bg,
          borderRadius:      borderRadius.full,
          paddingHorizontal: sz.px,
          paddingVertical:   sz.py,
        },
        style,
      ]}
    >
      <DSText
        variant="caption"
        weight="semibold"
        color={vc.text}
        style={{ fontSize: sz.fontSize }}
      >
        {label}
      </DSText>
    </View>
  );
};