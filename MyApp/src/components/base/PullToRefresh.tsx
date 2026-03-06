import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { DSText } from './Text';

interface PullToRefreshProps {
  isRefreshing: boolean;
  pullDistance: SharedValue<number>;
  threshold?:   number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshProps> = ({
  isRefreshing,
  pullDistance,
  threshold = 80,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRefreshing) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 800 }),
        -1,
        false,
      );
    } else {
      rotation.value = withSpring(0);
    }
  }, [isRefreshing]);

  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      pullDistance.value,
      [0, threshold],
      [0, 60],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      pullDistance.value,
      [0, threshold * 0.5, threshold],
      [0, 0.5, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: isRefreshing
          ? `${rotation.value}deg`
          : `${interpolate(pullDistance.value, [0, threshold], [0, 180], Extrapolation.CLAMP)}deg`,
      },
      {
        scale: interpolate(
          pullDistance.value,
          [0, threshold],
          [0.5, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
        },
        containerStyle,
      ]}
    >
      <Animated.View style={spinnerStyle}>
        <DSText variant="h3">↓</DSText>
      </Animated.View>
      {isRefreshing && (
        <DSText
          variant="caption"
          color={colors.textSecondary}
          style={{ marginLeft: spacing[2] }}
        >
          Refreshing...
        </DSText>
      )}
    </Animated.View>
  );
};
