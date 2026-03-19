import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  FlatList,
} from 'react-native';
import { useTheme }            from '../theme';
import { DSText }              from '../components/base/Text';
import { AnimatedProductCard } from '../components/base/AnimatedProductCard';
import { SearchBar }           from '../components/base/SearchBar';
import { CategoryFilter, SortPicker } from '../components/base/FilterComponents';
import { SkeletonGrid }        from '../components/base/SkeletonLoader';
import { useProductList }      from '../hooks/useProductList';
import type { Product }        from '../data/products';

const CARD_HEIGHT  = 240;
const COLUMN_GAP   = 12;
const SIDE_PADDING = 16;
const NUM_COLUMNS  = 2;
const HEADER_MAX   = 120;
const HEADER_MIN   = 56;

export const ProductListScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;

  const {
    searchQuery, activeCategory, sortOption,
    products, totalCount, hasMore, isLoadingMore,
    categories,
    handleSearch, handleCategoryChange, handleSortChange, loadMore,
  } = useProductList();

  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Simulate initial skeleton
  React.useEffect(() => {
    const t = setTimeout(() => setIsInitialLoad(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // ── Scroll animation (built-in) ─────────────
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange:  [0, HEADER_MAX - HEADER_MIN],
    outputRange: [HEADER_MAX, HEADER_MIN],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange:  [0, (HEADER_MAX - HEADER_MIN) * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const subtitleHeight = scrollY.interpolate({
    inputRange:  [0, HEADER_MAX - HEADER_MIN],
    outputRange: [22, 0],
    extrapolate: 'clamp',
  });

  // ── Pull to refresh ─────────────────────────
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  // ── Gesture callbacks ───────────────────────
  const handleDelete   = useCallback((p: Product) => console.log('Deleted:',   p.name), []);
  const handleFavorite = useCallback((p: Product) => console.log('Favorited:', p.name), []);

  // ── Render item ─────────────────────────────
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <AnimatedProductCard
        product={item}
        index={index}
        onPress={(p) => console.log('Pressed:', p.name)}
        onDelete={handleDelete}
        onFavorite={handleFavorite}
      />
    ),
    [handleDelete, handleFavorite]
  );

  const keyExtractor  = useCallback((item: Product) => item.id, []);
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_HEIGHT + COLUMN_GAP,
    offset: (CARD_HEIGHT + COLUMN_GAP) * Math.floor(index / NUM_COLUMNS),
    index,
  }), []);

  // ── List sub-components ─────────────────────
  const ListHeader = useCallback(() => (
    <View>
      <SearchBar value={searchQuery} onChangeText={handleSearch} resultCount={totalCount} />
      <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={handleCategoryChange} />
      <View style={[styles.sortRow, { paddingHorizontal: spacing[4], paddingVertical: spacing[2] }]}>
        <DSText variant="bodySmall" color={colors.textSecondary}>{totalCount} products</DSText>
        <SortPicker value={sortOption} onChange={handleSortChange} />
      </View>
    </View>
  ), [searchQuery, totalCount, categories, activeCategory, sortOption,
      handleSearch, handleCategoryChange, handleSortChange, spacing, colors]);

  const ListFooter = useCallback(() =>
    isLoadingMore ? (
      <View style={[styles.footer, { paddingVertical: spacing[5] }]}>
        <ActivityIndicator color={colors.primary} />
        <DSText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing[2] }}>
          Loading more...
        </DSText>
      </View>
    ) : <View style={{ height: spacing[6] }} />
  , [isLoadingMore, colors, spacing]);

  const ListEmpty = useCallback(() => (
    <View style={[styles.emptyState, { paddingVertical: spacing[16] }]}>
      <DSText variant="h3" style={{ marginBottom: spacing[3] }}>🔍</DSText>
      <DSText variant="h4" weight="semibold" align="center">No products found</DSText>
      <DSText variant="body" color={colors.textSecondary} align="center" style={{ marginTop: spacing[2] }}>
        Try adjusting your search or filters
      </DSText>
    </View>
  ), [colors, spacing]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Collapsing animated header ── */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor:   colors.primary,
            paddingHorizontal: spacing[5],
            paddingBottom:     spacing[3],
            height:            headerHeight,
            ...shadows.md,
          },
        ]}
      >
        <View style={[styles.circle1, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
        <View style={[styles.circle2, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

        <View style={styles.headerRow}>
          <View>
            <DSText variant="h3" weight="bold" color="#fff">🛍️ Shop</DSText>
            <Animated.View style={{ opacity: subtitleOpacity, height: subtitleHeight, overflow: 'hidden' }}>
              <DSText variant="bodySmall" color="rgba(255,255,255,0.75)">
                Discover amazing products
              </DSText>
            </Animated.View>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: borderRadius.full }]}
          >
            <DSText variant="caption">{isDark ? '☀️' : '🌙'}</DSText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Gesture hint ── */}
      <View style={[styles.hint, { backgroundColor: colors.surfaceVariant, paddingVertical: spacing[2] }]}>
        <DSText variant="caption" color={colors.textSecondary} align="center">
          👈 Swipe left to delete  •  Swipe right to favorite
        </DSText>
      </View>

      {/* ── Content ── */}
      {isInitialLoad ? (
        <SkeletonGrid count={6} />
      ) : (
        <Animated.FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}

          // Performance
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={8}
          initialNumToRender={6}
          updateCellsBatchingPeriod={50}

          // Scroll animation
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}

          // Pull to refresh
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }

          // Sub-components
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}

          // Infinite scroll
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}

          // Layout
          columnWrapperStyle={{ paddingHorizontal: SIDE_PADDING, gap: COLUMN_GAP }}
          contentContainerStyle={{ paddingBottom: spacing[8] }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-end',
    overflow:       'hidden',
    position:       'relative',
  },
  headerRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  themeBtn: { padding: 8 },
  circle1: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
  },
  circle2: {
    position: 'absolute', bottom: -20, right: 80,
    width: 100, height: 100, borderRadius: 50,
  },
  hint:       { alignItems: 'center' },
  sortRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footer:     { alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingHorizontal: 32 },
});
