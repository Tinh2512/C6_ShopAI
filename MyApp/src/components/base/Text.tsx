import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { TextProps, TextVariant, TextWeight } from '../../types';

const variantStyles: Record<TextVariant, { fontSize: number; lineHeight: number }> = {
  h1:        { fontSize: 36, lineHeight: 44 },
  h2:        { fontSize: 30, lineHeight: 38 },
  h3:        { fontSize: 24, lineHeight: 32 },
  h4:        { fontSize: 20, lineHeight: 28 },
  body:      { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 20 },
  caption:   { fontSize: 12, lineHeight: 16 },
  label:     { fontSize: 14, lineHeight: 20 },
};

const weightMap: Record<TextWeight, TextStyle['fontWeight']> = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
};

export const DSText: React.FC<TextProps> = ({
  variant       = 'body',
  weight        = 'regular',
  color,
  align         = 'left',
  children,
  style,
  numberOfLines,
}) => {
  const { theme } = useTheme();
  const vs = variantStyles[variant];

  const defaultColor =
    ['h1', 'h2', 'h3', 'h4', 'body', 'bodySmall'].includes(variant)
      ? theme.colors.textPrimary
      : theme.colors.textSecondary;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize:   vs.fontSize,
          lineHeight: vs.lineHeight,
          fontWeight: weightMap[weight],
          color:      color ?? defaultColor,
          textAlign:  align,
          fontFamily: theme.typography.fontFamily.sans,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};