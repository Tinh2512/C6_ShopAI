import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme }     from '../../theme';
import { DSText }       from '../../components/base/Text';
import { Button }       from '../../components/base/Button';
import { Card }         from '../../components/base/Card';
import { useCartStore } from '../../store/cartStore';
import { useUIStore }   from '../../store/productStore';
import type { CartItem } from '../../store/cartStore';

// ─── Cart Item Row ────────────────────────────
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { theme }   = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const removeItem  = useCartStore(s => s.removeItem);
  const updateQty   = useCartStore(s => s.updateQty);
  const showToast   = useUIStore(s => s.showToast);

  const handleRemove = () => {
    removeItem(item.product.id);
    showToast(`${item.product.name} removed`, 'info');
  };

  return (
    <View
      style={[
        styles.cartItem,
        {
          backgroundColor: colors.surface,
          borderRadius:    borderRadius.lg,
          padding:         spacing[3],
          marginBottom:    spacing[3],
          ...shadows.sm,
        },
      ]}
    >
      <Image source={{ uri: item.product.image }} style={[styles.itemImage, { borderRadius: borderRadius.md }]} />

      <View style={{ flex: 1, marginLeft: spacing[3] }}>
        <DSText variant="bodySmall" weight="semibold" numberOfLines={2}>{item.product.name}</DSText>
        <DSText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
          {item.product.category}
        </DSText>
        <DSText variant="body" weight="bold" color={colors.primary} style={{ marginTop: spacing[1] }}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </DSText>
      </View>

      <View style={styles.qtyControls}>
        {/* Remove */}
        <TouchableOpacity onPress={handleRemove} style={{ marginBottom: spacing[2] }}>
          <DSText variant="caption" color={colors.error}>🗑️</DSText>
        </TouchableOpacity>

        {/* Qty stepper */}
        <View style={[styles.stepper, { borderColor: colors.border, borderRadius: borderRadius.md }]}>
          <TouchableOpacity
            onPress={() => updateQty(item.product.id, item.quantity - 1)}
            style={[styles.stepBtn, { backgroundColor: colors.surfaceVariant }]}
          >
            <DSText variant="body" weight="bold">−</DSText>
          </TouchableOpacity>
          <DSText variant="label" weight="semibold" style={{ minWidth: 28, textAlign: 'center' }}>
            {item.quantity}
          </DSText>
          <TouchableOpacity
            onPress={() => updateQty(item.product.id, item.quantity + 1)}
            style={[styles.stepBtn, { backgroundColor: colors.surfaceVariant }]}
          >
            <DSText variant="body" weight="bold">+</DSText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Cart Screen ──────────────────────────────
export const CartScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const items      = useCartStore(s => s.items);
  const totalPrice = useCartStore(s => s.totalPrice);
  const clearCart  = useCartStore(s => s.clearCart);
  const showToast  = useUIStore(s => s.showToast);

  const handleCheckout = () => {
    clearCart();
    showToast('Order placed successfully! 🎉', 'success');
  };

  const renderItem = useCallback(({ item }: { item: CartItem }) => (
    <CartItemRow item={item} />
  ), []);

  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.topBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomColor: colors.border }]}>
          <DSText variant="h4" weight="bold">🛒 Cart</DSText>
        </View>
        <View style={styles.emptyState}>
          <DSText variant="h2" style={{ marginBottom: spacing[3] }}>🛒</DSText>
          <DSText variant="h4" weight="semibold" align="center">Your cart is empty</DSText>
          <DSText variant="body" color={colors.textSecondary} align="center" style={{ marginTop: spacing[2] }}>
            Add some products to get started
          </DSText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={[styles.topBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomColor: colors.border }]}>
        <DSText variant="h4" weight="bold">🛒 Cart ({items.length})</DSText>
        <TouchableOpacity onPress={clearCart}>
          <DSText variant="bodySmall" color={colors.error} weight="medium">Clear all</DSText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={i => i.product.id}
        contentContainerStyle={{ padding: spacing[4] }}
        showsVerticalScrollIndicator={false}
      />

      {/* ── Sticky checkout bar ── */}
      <View
        style={[
          styles.checkoutBar,
          {
            backgroundColor:   colors.surface,
            borderTopColor:    colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical:   spacing[4],
            ...shadows.xl,
          },
        ]}
      >
        <View style={[styles.row, { marginBottom: spacing[3] }]}>
          <DSText variant="body" color={colors.textSecondary}>Subtotal</DSText>
          <DSText variant="body" weight="semibold">${totalPrice().toFixed(2)}</DSText>
        </View>
        <View style={[styles.row, { marginBottom: spacing[3] }]}>
          <DSText variant="body" color={colors.textSecondary}>Shipping</DSText>
          <DSText variant="body" weight="semibold" color={colors.success}>Free</DSText>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: spacing[3] }]} />
        <View style={[styles.row, { marginBottom: spacing[4] }]}>
          <DSText variant="h4" weight="bold">Total</DSText>
          <DSText variant="h4" weight="bold" color={colors.primary}>${totalPrice().toFixed(2)}</DSText>
        </View>
        <Button label="Checkout →" variant="primary" size="lg" onPress={handleCheckout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartItem:    { flexDirection: 'row', alignItems: 'center' },
  itemImage:   { width: 80, height: 80 },
  qtyControls: { alignItems: 'center', marginLeft: 8 },
  stepper:     { flexDirection: 'row', alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  stepBtn:     { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  checkoutBar: { borderTopWidth: 1 },
  divider:     { height: 1 },
  emptyState:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
