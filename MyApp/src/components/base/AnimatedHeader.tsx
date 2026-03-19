import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { DSText } from './Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 160;

interface AnimatedHeaderProps {
  scrollY:      SharedValue<number>;
  title:        string;
  subtitle?:    string;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  scrollY,
  title,
  subtitle,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  // ── Parallax background ────────────────────
  const bgStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT],
        [0, -HEADER_HEIGHT / 2],
        Extrapolation.CLAMP,
      ),
    }],
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.6, HEADER_HEIGHT],
      [1, 0.6, 0],
      Extrapolation.CLAMP,
    ),
  }));

  // ── Sticky mini-header ─────────────────────
  const stickyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
        [-20, 0],
        Extrapolation.CLAMP,
      ),
    }],
  }));

  return (
    <>
      {/* ── Parallax hero header ── */}
      <Animated.View
        style={[
          styles.heroHeader,
          {
            backgroundColor: colors.primary,
            height:          HEADER_HEIGHT,
          },
          bgStyle,
        ]}
      >
        <View style={[styles.heroContent, { padding: spacing[5] }]}>
          <DSText variant="h2" weight="bold" color="#fff">
            {title}
          </DSText>
          {subtitle && (
            <DSText variant="body" color="rgba(255,255,255,0.8)" style={{ marginTop: spacing[1] }}>
              {subtitle}
            </DSText>
          )}
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
      </Animated.View>

      {/* ── Sticky compact header ── */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical:   spacing[3],
          },
          stickyStyle,
        ]}
        pointerEvents="none"
      >
        <DSText variant="h4" weight="bold">{title}</DSText>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  heroHeader: {
    overflow:   'hidden',
    position:   'relative',
    justifyContent: 'flex-end',
  },
  heroContent: {
    zIndex: 1,
  },
  stickyHeader: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    borderBottomWidth: 1,
    zIndex:          10,
  },
  circle1: {
    position:        'absolute',
    top:             -40,
    right:           -40,
    width:           160,
    height:          160,
    borderRadius:    80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circle2: {
    position:        'absolute',
    bottom:          -20,
    right:           60,
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
