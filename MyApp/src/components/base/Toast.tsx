import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme }   from '../../theme';
import { DSText }     from './Text';
import { useUIStore } from '../../store/productStore';

export const Toast: React.FC = () => {
  const { theme }                   = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;
  const { toastMessage, toastType } = useUIStore();

  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0,   useNativeDriver: true, damping: 15 }),
        Animated.timing(opacity,    { toValue: 1,   duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,   duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  const bgColor = { success: colors.success, error: colors.error, info: colors.info }[toastType];
  const icon    = { success: '✅', error: '❌', info: 'ℹ️' }[toastType];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor:   bgColor,
          borderRadius:      borderRadius.lg,
          paddingHorizontal: spacing[4],
          paddingVertical:   spacing[3],
          marginHorizontal:  spacing[4],
          ...shadows.lg,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <DSText variant="body" style={{ marginRight: spacing[2] }}>{icon}</DSText>
      <DSText variant="bodySmall" weight="semibold" color="#fff" style={{ flex: 1 }}>
        {toastMessage}
      </DSText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position:      'absolute',
    top:           60,
    left:          0,
    right:         0,
    zIndex:        999,
    flexDirection: 'row',
    alignItems:    'center',
  },
});
