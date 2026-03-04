import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { DSText } from './Text';
import type { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  disabled        = false,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.borderFocus
      : colors.border;

  const bgColor = disabled ? colors.surfaceVariant : colors.surface;

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <DSText
          variant="label"
          weight="medium"
          color={error ? colors.error : colors.textPrimary}
          style={{ marginBottom: spacing[1] }}
        >
          {label}
        </DSText>
      )}

      <View
        style={[
          styles.inputRow,
          {
            borderColor,
            borderRadius: borderRadius.md,
            backgroundColor: bgColor,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[3],
            borderWidth: focused ? 2 : 1.5,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {leftIcon && (
          <View style={{ marginRight: spacing[2] }}>{leftIcon}</View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.textInput,
            {
              color:    colors.textPrimary,
              fontSize: typography.fontSize.base,
            },
          ]}
        />

        {rightIcon && (
          <View style={{ marginLeft: spacing[2] }}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <DSText
          variant="caption"
          color={error ? colors.error : colors.textSecondary}
          style={{ marginTop: spacing[1] }}
        >
          {error ?? helperText}
        </DSText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 0,   // remove default native padding
  },
});
