import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import type { StackProps, ContainerProps, GridProps } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────
// Stack — horizontal or vertical flex container
// ─────────────────────────────────────────────
export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing   = 0,
  align     = 'stretch',
  justify   = 'flex-start',
  wrap      = false,
  children,
  style,
}) => {
  const { theme } = useTheme();

  // Inject gap-equivalent margins between children
  const childArray = React.Children.toArray(children);

  return (
    <View
      style={[
        {
          flexDirection:  direction,
          alignItems:     align,
          justifyContent: justify,
          flexWrap:       wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
    >
      {childArray.map((child, i) => (
        <View
          key={i}
          style={
            i < childArray.length - 1
              ? direction === 'row'
                ? { marginRight: spacing }
                : { marginBottom: spacing }
              : undefined
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────
// Container — centred, max-width wrapper
// ─────────────────────────────────────────────
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 600,
  padding,
  children,
  style,
}) => {
  const { theme } = useTheme();
  const defaultPadding = theme.spacing[4];

  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth,
          alignSelf: 'center',
          paddingHorizontal: padding ?? defaultPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ─────────────────────────────────────────────
// Grid — responsive multi-column layout
// ─────────────────────────────────────────────
export const Grid: React.FC<GridProps> = ({
  columns = 2,
  gap     = 12,
  children,
  style,
}) => {
  const childArray  = React.Children.toArray(children);
  const itemWidth   = (SCREEN_WIDTH - gap * (columns + 1)) / columns;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap:      'wrap',
          padding:       gap,
          gap:           gap,
        },
        style,
      ]}
    >
      {childArray.map((child, i) => (
        <View key={i} style={{ width: itemWidth }}>
          {child}
        </View>
      ))}
    </View>
  );
};
