import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps }   from '@react-navigation/bottom-tabs';

// ─── Root Stack ───────────────────────────────
export type RootStackParamList = {
  MainTabs:      undefined;
  ProductDetail: { productId: string };
  Cart:          undefined;
};

// ─── Bottom Tabs ──────────────────────────────
export type TabParamList = {
  Home:    undefined;
  Shop:    undefined;
  Cart:    undefined;
  Profile: undefined;
};

// ─── Screen props helpers ─────────────────────
export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabProps<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;
