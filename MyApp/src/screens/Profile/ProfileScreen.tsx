import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useTheme }        from '../../theme';
import { DSText }          from '../../components/base/Text';
import { Card }            from '../../components/base/Card';
import { Badge }           from '../../components/base/Badge';
import { Button }          from '../../components/base/Button';
import { useProductStore } from '../../store/productStore';
import { useCartStore }    from '../../store/cartStore';
import { PRODUCTS }        from '../../data/products';

const MenuItem: React.FC<{ icon: string; label: string; value?: string; onPress?: () => void }> = ({
  icon, label, value, onPress,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuItem, { paddingHorizontal: spacing[4], paddingVertical: spacing[4], borderBottomColor: colors.border }]}
    >
      <DSText variant="body" style={{ marginRight: spacing[3] }}>{icon}</DSText>
      <DSText variant="body" style={{ flex: 1 }}>{label}</DSText>
      {value && <DSText variant="bodySmall" color={colors.textSecondary}>{value}</DSText>}
      <DSText variant="body" color={colors.textSecondary}> ›</DSText>
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const favorites     = useProductStore(s => s.favorites);
  const totalOrders   = useCartStore(s => s.items.length);

  const favoriteProducts = PRODUCTS.filter(p => favorites.includes(p.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomColor: colors.border }]}>
        <DSText variant="h4" weight="bold">👤 Profile</DSText>
        <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full }]}>
          <DSText variant="caption">{isDark ? '☀️' : '🌙'}</DSText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[8] }}>

        {/* Avatar */}
        <View style={[styles.avatarSection, { paddingVertical: spacing[6], backgroundColor: colors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40 }]}>
            <DSText variant="h2">👤</DSText>
          </View>
          <DSText variant="h4" weight="bold" color="#fff" style={{ marginTop: spacing[3] }}>John Doe</DSText>
          <DSText variant="bodySmall" color="rgba(255,255,255,0.8)">john.doe@example.com</DSText>
          <View style={[styles.row, { marginTop: spacing[4], gap: spacing[6] }]}>
            <View style={styles.statItem}>
              <DSText variant="h3" weight="bold" color="#fff">{favorites.length}</DSText>
              <DSText variant="caption" color="rgba(255,255,255,0.8)">Favorites</DSText>
            </View>
            <View style={styles.statItem}>
              <DSText variant="h3" weight="bold" color="#fff">12</DSText>
              <DSText variant="caption" color="rgba(255,255,255,0.8)">Orders</DSText>
            </View>
            <View style={styles.statItem}>
              <DSText variant="h3" weight="bold" color="#fff">4.9</DSText>
              <DSText variant="caption" color="rgba(255,255,255,0.8)">Rating</DSText>
            </View>
          </View>
        </View>

        {/* Favorites */}
        {favoriteProducts.length > 0 && (
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <DSText variant="h4" weight="bold" style={{ marginBottom: spacing[3] }}>❤️ Favorites ({favoriteProducts.length})</DSText>
            {favoriteProducts.slice(0, 3).map(p => (
              <Card key={p.id} variant="outlined" style={{ marginBottom: spacing[2] }}>
                <View style={styles.row}>
                  <DSText variant="body" style={{ flex: 1 }}>{p.name}</DSText>
                  <DSText variant="body" weight="bold" color={colors.primary}>${p.price}</DSText>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Menu */}
        <Card variant="elevated" style={{ marginHorizontal: spacing[4], marginBottom: spacing[4] }}>
          <MenuItem icon="📦" label="My Orders"    value="12 orders" />
          <MenuItem icon="📍" label="Addresses"    value="2 saved" />
          <MenuItem icon="💳" label="Payment"      value="•••• 4242" />
          <MenuItem icon="🔔" label="Notifications" />
          <MenuItem icon="🛡️" label="Privacy"      />
          <MenuItem icon="❓" label="Help & Support" />
        </Card>

        <View style={{ paddingHorizontal: spacing[4] }}>
          <Button label="Sign Out" variant="outline" size="md" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  iconBtn:       { padding: 8 },
  avatarSection: { alignItems: 'center' },
  avatar:        { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  row:           { flexDirection: 'row', alignItems: 'center' },
  statItem:      { alignItems: 'center' },
  menuItem:      { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
});
