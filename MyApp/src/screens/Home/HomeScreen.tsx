import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { useNavigation }      from '@react-navigation/native';
import { useTheme }           from '../../theme';
import { DSText }             from '../../components/base/Text';
import { Card }               from '../../components/base/Card';
import { Badge }              from '../../components/base/Badge';
import { AnimatedProductCard } from '../../components/base/AnimatedProductCard';
import { useCartStore }       from '../../store/cartStore';
import { useUIStore }         from '../../store/productStore';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList }        from '../../navigation/types';

const { width: W } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Hero banners ─────────────────────────────
const BANNERS = [
  { id: '1', title: 'Summer Sale',   subtitle: 'Up to 50% off',   bg: '#2563eb', emoji: '☀️' },
  { id: '2', title: 'New Arrivals',  subtitle: 'Fresh picks',      bg: '#7c3aed', emoji: '✨' },
  { id: '3', title: 'Flash Deals',   subtitle: 'Today only',       bg: '#dc2626', emoji: '⚡' },
];

// ─── Countdown timer ─────────────────────────
const useCountdown = (seconds: number) => {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setTime(p => (p > 0 ? p - 1 : seconds)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

// ─── Hero Carousel ────────────────────────────
const HeroCarousel: React.FC = () => {
  const { theme } = useTheme();
  const { spacing, borderRadius } = theme;
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (active + 1) % BANNERS.length;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActive(next);
    }, 3000);
    return () => clearInterval(t);
  }, [active]);

  return (
    <View style={{ marginBottom: spacing[4] }}>
      <FlatList
        ref={flatRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={b => b.id}
        onMomentumScrollEnd={e => setActive(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => (
          <View style={[styles.banner, { width: W, backgroundColor: item.bg }]}>
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />
            <View style={{ padding: 24, zIndex: 1 }}>
              <DSText variant="h1" style={{ marginBottom: 4 }}>{item.emoji}</DSText>
              <DSText variant="h2" weight="bold" color="#fff">{item.title}</DSText>
              <DSText variant="body" color="rgba(255,255,255,0.8)">{item.subtitle}</DSText>
              <TouchableOpacity
                style={[styles.bannerBtn, { borderRadius: borderRadius.full, marginTop: 12 }]}
              >
                <DSText variant="label" weight="bold" color="#1e40af">Shop Now →</DSText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === active ? '#fff' : 'rgba(255,255,255,0.4)' },
              i === active && { width: 20 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Section Header ───────────────────────────
const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({ title, onSeeAll }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.sectionHeader, { paddingHorizontal: theme.spacing[4], marginBottom: theme.spacing[3] }]}>
      <DSText variant="h4" weight="bold">{title}</DSText>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <DSText variant="bodySmall" weight="medium" color={theme.colors.primary}>See all</DSText>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Flash Sale Section ───────────────────────
const FlashSale: React.FC<{ onProductPress: (id: string) => void }> = ({ onProductPress }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  const countdown = useCountdown(3600 * 5 + 60 * 23 + 45);
  const saleProducts = PRODUCTS.filter(p => p.originalPrice).slice(0, 6);

  return (
    <View style={{ marginBottom: spacing[6] }}>
      <View style={[styles.flashHeader, { paddingHorizontal: spacing[4], marginBottom: spacing[3] }]}>
        <View style={styles.row}>
          <DSText variant="h4" weight="bold">⚡ Flash Sale</DSText>
          <Badge label="LIMITED" variant="error" size="sm" style={{ marginLeft: spacing[2] }} />
        </View>
        <View style={[styles.countdownBox, { backgroundColor: colors.error, borderRadius: borderRadius.md, padding: spacing[2] }]}>
          <DSText variant="label" weight="bold" color="#fff">{countdown}</DSText>
        </View>
      </View>
      <FlatList
        horizontal
        data={saleProducts}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[3] }}
        keyExtractor={p => p.id}
        renderItem={({ item, index }) => (
          <AnimatedProductCard
            product={item}
            index={index}
            onPress={(p) => onProductPress(p.id)}
          />
        )}
      />
    </View>
  );
};

// ─── Home Screen ──────────────────────────────
export const HomeScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  const navigation = useNavigation<Nav>();
  const addItem    = useCartStore(s => s.addItem);
  const showToast  = useUIStore(s => s.showToast);

  const handleProductPress = useCallback((id: string) => {
    navigation.navigate('ProductDetail', { productId: id });
  }, [navigation]);

  const featuredProducts = PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 6);
  const newArrivals      = PRODUCTS.slice(-8);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomColor: colors.border }]}>
        <View>
          <DSText variant="caption" color={colors.textSecondary}>Good morning 👋</DSText>
          <DSText variant="h4" weight="bold">Discover</DSText>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full, marginRight: spacing[2] }]}
          >
            <DSText variant="caption">{isDark ? '☀️' : '🌙'}</DSText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full }]}
          >
            <DSText variant="caption">🛒</DSText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[8] }}>

        {/* Hero carousel */}
        <HeroCarousel />

        {/* Categories */}
        <SectionHeader title="Categories" />
        <FlatList
          horizontal
          data={CATEGORIES.filter(c => c.id !== 'all')}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[3], marginBottom: spacing[6] }}
          keyExtractor={c => c.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing[3], ...theme.shadows.sm }]}>
              <DSText variant="h3" align="center">{item.icon}</DSText>
              <DSText variant="caption" weight="medium" align="center" style={{ marginTop: spacing[1] }}>{item.name}</DSText>
            </TouchableOpacity>
          )}
        />

        {/* Flash sale */}
        <FlashSale onProductPress={handleProductPress} />

        {/* Featured products */}
        <SectionHeader title="⭐ Top Rated" onSeeAll={() => {}} />
        <FlatList
          horizontal
          data={featuredProducts}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[3], marginBottom: spacing[6] }}
          keyExtractor={p => p.id}
          renderItem={({ item, index }) => (
            <AnimatedProductCard product={item} index={index} onPress={p => handleProductPress(p.id)} />
          )}
        />

        {/* New arrivals */}
        <SectionHeader title="🆕 New Arrivals" onSeeAll={() => {}} />
        <FlatList
          horizontal
          data={newArrivals}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[3], marginBottom: spacing[4] }}
          keyExtractor={p => p.id}
          renderItem={({ item, index }) => (
            <AnimatedProductCard product={item} index={index} onPress={p => handleProductPress(p.id)} />
          )}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  iconBtn:       { padding: 8 },
  row:           { flexDirection: 'row', alignItems: 'center' },
  banner:        { height: 200, justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  bannerCircle1: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)' },
  bannerCircle2: { position: 'absolute', bottom: -30, right: 60, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },
  bannerBtn:     { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8 },
  dots:          { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flashHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countdownBox:  {},
  categoryItem:  { alignItems: 'center', minWidth: 72 },
});
