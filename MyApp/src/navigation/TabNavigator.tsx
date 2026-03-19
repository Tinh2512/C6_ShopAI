import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet }         from 'react-native';
import { useTheme }                 from '../theme';
import { DSText }                   from '../components/base/Text';
import { HomeScreen }               from '../screens/Home/HomeScreen';
import { ProductListScreen }        from '../screens/ProductListScreen';
import { CartScreen }               from '../screens/Cart/CartScreen';
import { ProfileScreen }            from '../screens/Profile/ProfileScreen';
import { useCartStore }             from '../store/cartStore';
import type { TabParamList }        from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon: React.FC<{ emoji: string; label: string; focused: boolean; badgeCount?: number }> = ({
  emoji, label, focused, badgeCount,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <View style={styles.tabItem}>
      <View>
        <DSText variant="body">{emoji}</DSText>
        {badgeCount ? (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <DSText variant="caption" color="#fff" style={{ fontSize: 9 }}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </DSText>
          </View>
        ) : null}
      </View>
      <DSText
        variant="caption"
        weight={focused ? 'semibold' : 'regular'}
        color={focused ? colors.primary : colors.textSecondary}
        style={{ fontSize: 10, marginTop: 2 }}
      >
        {label}
      </DSText>
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { colors, shadows } = theme;
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:  colors.surface,
          borderTopColor:   colors.border,
          borderTopWidth:   1,
          height:           64,
          paddingBottom:    8,
          ...shadows.lg,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛍️" label="Shop" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛒" label="Cart" focused={focused} badgeCount={cartCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems:  'center',
    paddingTop:  4,
  },
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -8,
    minWidth:        16,
    height:          16,
    borderRadius:    8,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 3,
  },
});
