import React                              from 'react';
import { NavigationContainer }            from '@react-navigation/native';
import { createNativeStackNavigator }     from '@react-navigation/native-stack';
import { TabNavigator }                   from './TabNavigator';
import { ProductDetailScreen }            from '../screens/ProductDetail/ProductDetailScreen';
import type { RootStackParamList }        from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs"      component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
