import React, { memo, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';
import type { Category, SortOption } from '../../data/products';

// ─────────────────────────────────────────────
// Category Filter
// ─────────────────────────────────────────────
interface CategoryFilterProps {
  categories:      Category[];
  activeCategory:  string;
  onSelect:        (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = memo(({
  categories,
  activeCategory,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing[4],
        paddingVertical:   spacing[2],
        gap:               spacing[2],
      }}
    >
      {categories.map(cat => {
        const isActive = cat.id === activeCategory;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.chip,
              {
                backgroundColor:   isActive ? colors.primary : colors.surface,
                borderRadius:      borderRadius.full,
                paddingHorizontal: spacing[4],
                paddingVertical:   spacing[2],
                borderWidth:       isActive ? 0 : 1.5,
                borderColor:       colors.border,
                ...theme.shadows.sm,
              },
            ]}
          >
            <DSText variant="caption" style={{ marginRight: 4 }}>{cat.icon}</DSText>
            <DSText
              variant="label"
              weight={isActive ? 'semibold' : 'regular'}
              color={isActive ? colors.textInverse : colors.textPrimary}
            >
              {cat.name}
            </DSText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

// ─────────────────────────────────────────────
// Sort Picker
// ─────────────────────────────────────────────
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default',    label: 'Default' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

interface SortPickerProps {
  value:    SortOption;
  onChange: (sort: SortOption) => void;
}

export const SortPicker: React.FC<SortPickerProps> = memo(({ value, onChange }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const [visible, setVisible] = React.useState(false);

  const currentLabel = SORT_OPTIONS.find(o => o.value === value)?.label ?? 'Sort';

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[
          styles.sortButton,
          {
            backgroundColor:   colors.surface,
            borderRadius:      borderRadius.lg,
            borderColor:       value !== 'default' ? colors.primary : colors.border,
            borderWidth:       1.5,
            paddingHorizontal: spacing[3],
            paddingVertical:   spacing[2],
            ...shadows.sm,
          },
        ]}
      >
        <DSText variant="caption">⇅ </DSText>
        <DSText
          variant="label"
          weight="medium"
          color={value !== 'default' ? colors.primary : colors.textPrimary}
        >
          {currentLabel}
        </DSText>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.surface,
                borderRadius:    borderRadius['2xl'],
                padding:         spacing[5],
              },
            ]}
          >
            <DSText variant="h4" weight="bold" style={{ marginBottom: spacing[4] }}>
              Sort By
            </DSText>

            {SORT_OPTIONS.map(opt => {
              const isActive = opt.value === value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => { onChange(opt.value); setVisible(false); }}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor:   isActive ? colors.primaryLight : 'transparent',
                      borderRadius:      borderRadius.md,
                      paddingHorizontal: spacing[4],
                      paddingVertical:   spacing[3],
                      marginBottom:      spacing[1],
                    },
                  ]}
                >
                  <DSText
                    variant="body"
                    weight={isActive ? 'semibold' : 'regular'}
                    color={isActive ? colors.primary : colors.textPrimary}
                  >
                    {isActive ? '✓  ' : '    '}{opt.label}
                  </DSText>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

SortPicker.displayName = 'SortPicker';

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  modalOverlay: {
    flex:            1,
    justifyContent:  'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    width: '100%',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems:    'center',
  },
});
