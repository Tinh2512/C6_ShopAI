  import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';

interface SearchBarProps {
  value:         string;
  onChangeText:  (text: string) => void;
  placeholder?:  string;
  resultCount?:  number;
}

export const SearchBar: React.FC<SearchBarProps> = memo(({
  value,
  onChangeText,
  placeholder  = 'Search products...',
  resultCount,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor:   colors.surface,
            borderRadius:      borderRadius.xl,
            borderColor:       value ? colors.borderFocus : colors.border,
            borderWidth:       value ? 2 : 1.5,
            paddingHorizontal: spacing[4],
            paddingVertical:   spacing[3],
            ...theme.shadows.sm,
          },
        ]}
      >
        {/* Search icon */}
        <DSText variant="body" style={{ marginRight: spacing[2] }}>🔍</DSText>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          style={[
            styles.input,
            {
              color:    colors.textPrimary,
              fontSize: typography.fontSize.base,
            },
          ]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {/* Clear button */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={{ marginLeft: spacing[2] }}>
            <DSText variant="body" color={colors.textSecondary}>✕</DSText>
          </TouchableOpacity>
        )}
      </View>

      {/* Result count */}
      {resultCount !== undefined && value.length > 0 && (
        <DSText
          variant="caption"
          color={colors.textSecondary}
          style={{ marginTop: spacing[1], marginLeft: spacing[1] }}
        >
          {resultCount} result{resultCount !== 1 ? 's' : ''} for "{value}"
        </DSText>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  input: {
    flex:    1,
    padding: 0,
  },
});
