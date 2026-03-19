import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const ShimmerBlock: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}> = ({ width, height, borderRadius = 8, style }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: theme.colors.surfaceVariant, opacity },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;

  return (
    <View
      style={[
        {
          width:           CARD_WIDTH,
          backgroundColor: colors.surface,
          borderRadius:    borderRadius.lg,
          marginBottom:    12,
          overflow:        'hidden',
          ...shadows.sm,
        },
      ]}
    >
      <ShimmerBlock width="100%" height={140} borderRadius={0} />
      <View style={{ padding: spacing[3] }}>
        <ShimmerBlock width="90%" height={14} borderRadius={4} style={{ marginBottom: spacing[2] }} />
        <ShimmerBlock width="60%" height={12} borderRadius={4} style={{ marginBottom: spacing[2] }} />
        <ShimmerBlock width="40%" height={16} borderRadius={4} />
      </View>
    </View>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <View style={styles.grid}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection:     'row',
    flexWrap:          'wrap',
    paddingHorizontal: 16,
    gap:               12,
  },
});
