import React, { memo, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme';
import { DSText }   from './Text';
import type { Product } from '../../data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH      = (SCREEN_WIDTH - 48) / 2;
const SWIPE_THRESHOLD = 80;

interface AnimatedProductCardProps {
  product:     Product;
  index:       number;
  onPress?:    (product: Product) => void;
  onDelete?:   (product: Product) => void;
  onFavorite?: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.starRow}>
      <DSText variant="caption" style={{ color: '#f59e0b' }}>★</DSText>
      <DSText variant="caption" weight="medium" color={theme.colors.textPrimary}>
        {' '}{rating.toFixed(1)}
      </DSText>
      <DSText variant="caption" color={theme.colors.textSecondary}>
        {' '}({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
      </DSText>
    </View>
  );
};

export const AnimatedProductCard: React.FC<AnimatedProductCardProps> = memo(({
  product, index, onPress, onDelete, onFavorite,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, shadows } = theme;

  // ── Animated values ────────────────────────
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const scale      = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const favorited  = useRef(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  // ── Fade-in + slide-up on mount ────────────
  useEffect(() => {
    const delay = (index % 8) * 60;
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, [index]);

  // ── Press animations ───────────────────────
  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1.0,  useNativeDriver: true }).start();

  // ── Swipe gesture ──────────────────────────
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),

    onPanResponderMove: Animated.event(
      [null, { dx: translateX }],
      { useNativeDriver: false }
    ),

    onPanResponderRelease: (_, g) => {
      if (g.dx < -SWIPE_THRESHOLD) {
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH, duration: 250, useNativeDriver: true,
        }).start(() => onDelete?.(product));
        return;
      }
      if (g.dx > SWIPE_THRESHOLD) {
        favorited.current = !favorited.current;
        Animated.sequence([
          Animated.spring(heartScale, { toValue: 1.5, useNativeDriver: true }),
          Animated.spring(heartScale, { toValue: 1.0, useNativeDriver: true }),
        ]).start();
        onFavorite?.(product);
      }
      Animated.spring(translateX, {
        toValue: 0, useNativeDriver: true, friction: 6,
      }).start();
    },

    onPanResponderTerminate: () =>
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(),
  })).current;

  // ── Interpolated opacity for action bgs ────
  const deleteOpacity = translateX.interpolate({
    inputRange:  [-SWIPE_THRESHOLD, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });
  const favoriteOpacity = translateX.interpolate({
    inputRange:  [0, 20, SWIPE_THRESHOLD],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <View style={{ width: CARD_WIDTH, marginBottom: 12 }}>
      {/* Delete bg */}
      <Animated.View style={[styles.actionBg, { right: 0, backgroundColor: '#ef4444', borderRadius: borderRadius.lg, opacity: deleteOpacity }]}>
        <DSText variant="caption" color="#fff">🗑️ Delete</DSText>
      </Animated.View>

      {/* Favorite bg */}
      <Animated.View style={[styles.actionBg, { left: 0, backgroundColor: '#ec4899', borderRadius: borderRadius.lg, opacity: favoriteOpacity }]}>
        <DSText variant="caption" color="#fff">❤️ Like</DSText>
      </Animated.View>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadows.md },
          { opacity, transform: [{ translateY }, { scale }, { translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onPress?.(product)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={[styles.imageContainer, { borderRadius: borderRadius.lg }]}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

            {discount && (
              <View style={[styles.discountBadge, { backgroundColor: colors.error, borderRadius: borderRadius.sm }]}>
                <DSText variant="caption" weight="bold" color="#fff">-{discount}%</DSText>
              </View>
            )}

            <Animated.View style={[styles.heartBtn, { transform: [{ scale: heartScale }] }]}>
              <DSText variant="body">{favorited.current ? '❤️' : '🤍'}</DSText>
            </Animated.View>

            {!product.inStock && (
              <View style={[styles.outOfStock, { borderRadius: borderRadius.lg }]}>
                <DSText variant="caption" weight="semibold" color="#fff">Out of stock</DSText>
              </View>
            )}
          </View>

          <View style={{ padding: spacing[3] }}>
            <DSText variant="bodySmall" weight="semibold" numberOfLines={2} style={{ marginBottom: spacing[1] }}>
              {product.name}
            </DSText>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            <View style={[styles.priceRow, { marginTop: spacing[2] }]}>
              <DSText variant="body" weight="bold" color={colors.primary}>${product.price}</DSText>
              {product.originalPrice && (
                <DSText variant="caption" color={colors.textSecondary} style={styles.strikethrough}>
                  ${product.originalPrice}
                </DSText>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

AnimatedProductCard.displayName = 'AnimatedProductCard';

const styles = StyleSheet.create({
  card:           { overflow: 'hidden' },
  imageContainer: { position: 'relative', overflow: 'hidden' },
  image:          { width: '100%', height: 140 },
  discountBadge:  { position: 'absolute', top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 2 },
  heartBtn:       { position: 'absolute', top: 8, right: 8 },
  outOfStock:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  actionBg:       { position: 'absolute', top: 0, bottom: 0, width: CARD_WIDTH, alignItems: 'center', justifyContent: 'center' },
  starRow:        { flexDirection: 'row', alignItems: 'center' },
  priceRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strikethrough:  { textDecorationLine: 'line-through' },
});
