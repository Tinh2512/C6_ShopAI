// src/types/index.ts

import { TextStyle, ViewStyle } from 'react-native';

// ─── Button ─────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label:      string;
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  disabled?:  boolean;
  loading?:   boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?:   () => void;
  style?:     ViewStyle;
}

// ─── Input ──────────────────────────────────
export interface InputProps {
  label?:           string;
  placeholder?:     string;
  value?:           string;
  onChangeText?:    (text: string) => void;
  error?:           string;
  helperText?:      string;
  leftIcon?:        React.ReactNode;
  rightIcon?:       React.ReactNode;
  secureTextEntry?: boolean;
  disabled?:        boolean;
  style?:           ViewStyle;
}

// ─── Card ────────────────────────────────────
export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps {
  variant?:  CardVariant;
  children:  React.ReactNode;
  onPress?:  () => void;
  style?:    ViewStyle;
}

// ─── Text ────────────────────────────────────
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label';
export type TextWeight  = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  variant?:       TextVariant;
  weight?:        TextWeight;
  color?:         string;
  align?:         TextStyle['textAlign'];
  children:       React.ReactNode;
  style?:         TextStyle;
  numberOfLines?: number;
}

// ─── Badge ───────────────────────────────────
export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize    = 'sm' | 'md';

export interface BadgeProps {
  label:    string;
  variant?: BadgeVariant;
  size?:    BadgeSize;
  style?:   ViewStyle;
}

// ─── Layout ──────────────────────────────────
export interface StackProps {
  direction?: 'row' | 'column';
  spacing?:   number;
  align?:     ViewStyle['alignItems'];
  justify?:   ViewStyle['justifyContent'];
  wrap?:      boolean;
  children:   React.ReactNode;
  style?:     ViewStyle;
}

export interface ContainerProps {
  maxWidth?:  number;
  padding?:   number;
  children:   React.ReactNode;
  style?:     ViewStyle;
}

export interface GridProps {
  columns?:  number;
  gap?:      number;
  children:  React.ReactNode;
  style?:    ViewStyle;
}