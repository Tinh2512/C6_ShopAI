import React, { useCallback, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute }        from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme }        from '../../theme';
import { DSText }          from '../../components/base/Text';
import { Button }          from '../../components/base/Button';
import { Badge }           from '../../components/base/Badge';
import { Card }            from '../../components/base/Card';
import { useCartStore }    from '../../store/cartStore';
import { useProductStore, useUIStore } from '../../store/productStore';
import { PRODUCTS }        from '../../data/products';
import type { RootStackParamList, RootStackProps } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width: W } = Dimensions.get('window');

export const ProductDetailScreen: React.FC = () => {
  const { theme, isDark }  = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const navigation         = useNavigation<Nav>();
  const route              = useRoute<RootStackProps<'ProductDetail'>['route']>();
  const { productId }      = route.params;

  const product    = PRODUCTS.find(p => p.id === productId);
  const addItem    = useCartStore(s => s.addItem);
  const isInCart   = useCartStore(s => s.isInCart);
  const toggleFav  = useProductStore(s => s.toggleFavorite);
  const isFav      = useProductStore(s => s.isFavorite(productId));
  const showToast  = useUIStore(s => s.showToast);

  // RN Animated for button press (no Reanimated/Worklets)
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1.0,  duration: 100, useNativeDriver: true }),
    ]).start();
    addItem(product);
    showToast(`${product.name} added to cart 🛒`, 'success');
  }, [product, btnScale]);

  const handleToggleFav = useCallback(() => {
    if (!product) return;
    toggleFav(productId);
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', isFav ? 'info' : 'success');
  }, [productId, isFav]);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <DSText variant="h4">Product not found</DSText>
      </SafeAreaView>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full }]}
        >
          <DSText variant="body">←</DSText>
        </TouchableOpacity>
        <DSText variant="h4" weight="bold" numberOfLines={1} style={{ flex: 1, marginHorizontal: spacing[3] }}>
          {product.name}
        </DSText>
        <TouchableOpacity onPress={handleToggleFav}>
          <DSText variant="h4">{isFav ? '❤️' : '🤍'}</DSText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          {discount && (
            <View style={[styles.discountBadge, { backgroundColor: colors.error, borderRadius: borderRadius.md }]}>
              <DSText variant="label" weight="bold" color="#fff">-{discount}%</DSText>
            </View>
          )}
          {!product.inStock && (
            <View style={styles.outOfStock}>
              <DSText variant="body" weight="semibold" color="#fff">Out of Stock</DSText>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={{ padding: spacing[4] }}>
          <View style={[styles.row, { marginBottom: spacing[2] }]}>
            <Badge label={product.category} variant="info" />
            {product.inStock
              ? <Badge label="In Stock"     variant="success" />
              : <Badge label="Out of Stock" variant="error" />
            }
          </View>

          <DSText variant="h3" weight="bold" style={{ marginBottom: spacing[2] }}>
            {product.name}
          </DSText>

          {/* Rating */}
          <View style={[styles.row, { marginBottom: spacing[3] }]}>
            <DSText variant="body" style={{ color: '#f59e0b' }}>★★★★★</DSText>
            <DSText variant="body" weight="semibold" style={{ marginLeft: spacing[1] }}>{product.rating}</DSText>
            <DSText variant="bodySmall" color={colors.textSecondary} style={{ marginLeft: spacing[1] }}>
              ({product.reviewCount.toLocaleString()} reviews)
            </DSText>
          </View>

          {/* Price */}
          <View style={[styles.row, { marginBottom: spacing[4] }]}>
            <DSText variant="h2" weight="bold" color={colors.primary}>${product.price}</DSText>
            {product.originalPrice && (
              <DSText variant="h4" color={colors.textSecondary} style={styles.strikethrough}>
                ${product.originalPrice}
              </DSText>
            )}
            {discount && (
              <DSText variant="body" weight="bold" color={colors.success}>Save {discount}%</DSText>
            )}
          </View>

          {/* Tags */}
          <View style={[styles.tags, { marginBottom: spacing[4] }]}>
            {product.tags.map(tag => (
              <Badge key={tag} label={`#${tag}`} variant="default" size="sm"
                style={{ marginRight: spacing[2], marginBottom: spacing[1] }} />
            ))}
          </View>

          {/* Description */}
          <Card variant="outlined" style={{ marginBottom: spacing[4] }}>
            <DSText variant="h4" weight="semibold" style={{ marginBottom: spacing[2] }}>Description</DSText>
            <DSText variant="body" color={colors.textSecondary}>
              This is a premium quality {product.name} from our curated collection.
              Designed for everyday use with exceptional durability and style.
              Perfect for anyone looking for quality at a great price.
            </DSText>
          </Card>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <View>
              <DSText variant="h4" weight="bold" style={{ marginBottom: spacing[3] }}>
                Related Products
              </DSText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  {relatedProducts.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
                      style={[styles.relatedCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadows.sm }]}
                    >
                      <Image source={{ uri: p.image }} style={styles.relatedImage} />
                      <View style={{ padding: spacing[2] }}>
                        <DSText variant="caption" weight="semibold" numberOfLines={1}>{p.name}</DSText>
                        <DSText variant="caption" weight="bold" color={colors.primary}>${p.price}</DSText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Add to Cart */}
      <Animated.View
        style={[
          styles.addToCartBar,
          {
            backgroundColor:   colors.surface,
            borderTopColor:    colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical:   spacing[3],
            ...shadows.xl,
          },
          { transform: [{ scale: btnScale }] },
        ]}
      >
        <View style={styles.priceInBar}>
          <DSText variant="caption" color={colors.textSecondary}>Price</DSText>
          <DSText variant="h4" weight="bold" color={colors.primary}>${product.price}</DSText>
        </View>
        <Button
          label={isInCart(productId) ? '✓ In Cart' : '+ Add to Cart'}
          variant={isInCart(productId) ? 'outline' : 'primary'}
          size="lg"
          disabled={!product.inStock}
          onPress={handleAddToCart}
          style={{ flex: 1, marginLeft: spacing[3] }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
  backBtn:       { padding: 8 },
  imageContainer:{ position: 'relative' },
  image:         { width: W, height: W * 0.75 },
  discountBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 10, paddingVertical: 4 },
  outOfStock:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  row:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tags:          { flexDirection: 'row', flexWrap: 'wrap' },
  strikethrough: { textDecorationLine: 'line-through', marginLeft: 8 },
  relatedCard:   { width: 120, overflow: 'hidden' },
  relatedImage:  { width: 120, height: 100 },
  addToCartBar:  { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1 },
  priceInBar:    { alignItems: 'center' },
});
