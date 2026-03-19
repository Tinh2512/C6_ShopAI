import React, { memo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';
import { Badge }   from './Badge';
import type { Product } from '../../data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface ProductCardProps {
  product:  Product;
  onPress?: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.starRow}>
      <DSText variant="caption" style={{ color: '#f59e0b' }}>★</DSText>
      <DSText variant="caption" weight="medium" color={theme.colors.textPrimary}>
        {' '}{rating.toFixed(1)}
      </DSText>
      <DSText variant="caption" color={theme.colors.textSecondary}>
        {' '}({rating > 999 ? `${(rating / 1000).toFixed(1)}k` : rating})
      </DSText>
    </View>
  );
};

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, shadows } = theme;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(product)}
      style={[
        styles.card,
        {
          width:           CARD_WIDTH,
          backgroundColor: colors.surface,
          borderRadius:    borderRadius.lg,
          ...shadows.md,
        },
      ]}
    >
      {/* Image */}
      <View style={[styles.imageContainer, { borderRadius: borderRadius.lg }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Discount badge */}
        {discount && (
          <View style={[styles.discountBadge, { backgroundColor: colors.error, borderRadius: borderRadius.sm }]}>
            <DSText variant="caption" weight="bold" color="#fff">
              -{discount}%
            </DSText>
          </View>
        )}
        {/* Out of stock overlay */}
        {!product.inStock && (
          <View style={[styles.outOfStock, { borderRadius: borderRadius.lg }]}>
            <DSText variant="caption" weight="semibold" color="#fff">Out of stock</DSText>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: spacing[3] }}>
        <DSText
          variant="bodySmall"
          weight="semibold"
          numberOfLines={2}
          style={{ marginBottom: spacing[1] }}
        >
          {product.name}
        </DSText>

        <StarRating rating={product.rating} />

        {/* Price */}
        <View style={[styles.priceRow, { marginTop: spacing[2] }]}>
          <DSText variant="body" weight="bold" color={colors.primary}>
            ${product.price}
          </DSText>
          {product.originalPrice && (
            <DSText
              variant="caption"
              color={colors.textSecondary}
              style={styles.strikethrough}
            >
              ${product.originalPrice}
            </DSText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width:  '100%',
    height: 140,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  outOfStock: {
    position:        'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  starRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap: 6,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});
