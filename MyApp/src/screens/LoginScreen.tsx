import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTheme } from '../theme';
import { Button }  from '../components/base/Button';
import { DSText }  from '../components/base/Text';
import { Input }   from '../components/base/Input';
import { Card }    from '../components/base/Card';
import { Badge }   from '../components/base/Badge';
import { Container, Stack } from '../components/layout';

// Simple SVG-less icons using text (replace with react-native-vector-icons)
const EyeIcon    = () => <DSText variant="caption">👁</DSText>;
const EyeOffIcon = () => <DSText variant="caption">🙈</DSText>;
const EmailIcon  = () => <DSText variant="caption">✉️</DSText>;
const LockIcon   = () => <DSText variant="caption">🔒</DSText>;

export const LoginScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [emailError,  setEmailError]  = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Theme toggle ── */}
      <View style={{ position: 'absolute', top: 56, right: spacing[4], zIndex: 10 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            backgroundColor: colors.surfaceVariant,
            borderRadius: borderRadius.full,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
          }}
        >
          <DSText variant="caption">{isDark ? '☀️ Light' : '🌙 Dark'}</DSText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <Container maxWidth={480} padding={spacing[5]}>

          {/* ── Hero section ── */}
          <Stack direction="column" spacing={spacing[3]} align="center" style={{ marginBottom: spacing[8] }}>
            {/* Logo placeholder */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: borderRadius.xl,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                ...theme.shadows.lg,
              }}
            >
              <DSText variant="h3" color={colors.textInverse}>DS</DSText>
            </View>

            <DSText variant="h2" weight="bold" align="center">
              Welcome back
            </DSText>
            <DSText variant="body" color={colors.textSecondary} align="center">
              Sign in to your account to continue
            </DSText>
            <Badge label="Design System v1.0" variant="info" />
          </Stack>

          {/* ── Form card ── */}
          <Card variant="elevated">
            <Stack direction="column" spacing={spacing[4]}>

              <Input
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={validateEmail}
                error={emailError}
                helperText="We'll never share your email"
                leftIcon={<EmailIcon />}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                helperText="Minimum 8 characters"
                leftIcon={<LockIcon />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </TouchableOpacity>
                }
              />

              {/* Forgot password */}
              <View style={{ alignItems: 'flex-end', marginTop: -spacing[2] }}>
                <TouchableOpacity>
                  <DSText variant="bodySmall" weight="medium" color={colors.primary}>
                    Forgot password?
                  </DSText>
                </TouchableOpacity>
              </View>

              <Button
                label="Sign In"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!email || !password || !!emailError}
                onPress={handleLogin}
              />

            </Stack>
          </Card>

          {/* ── Divider ── */}
          <Stack
            direction="row"
            align="center"
            spacing={spacing[3]}
            style={{ marginVertical: spacing[5] }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <DSText variant="caption" color={colors.textSecondary}>OR</DSText>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </Stack>

          {/* ── Social buttons ── */}
          <Stack direction="column" spacing={spacing[3]}>
            <Button label="Continue with Google"  variant="outline" size="md" />
            <Button label="Continue with Apple"   variant="outline" size="md" />
          </Stack>

          {/* ── Sign up link ── */}
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing={spacing[1]}
            style={{ marginTop: spacing[6] }}
          >
            <DSText variant="bodySmall" color={colors.textSecondary}>
              Don't have an account?
            </DSText>
            <TouchableOpacity>
              <DSText variant="bodySmall" weight="semibold" color={colors.primary}>
                Sign Up
              </DSText>
            </TouchableOpacity>
          </Stack>

          {/* ── Component showcase ── */}
          <Card variant="outlined" style={{ marginTop: spacing[8] }}>
            <DSText variant="h4" weight="bold" style={{ marginBottom: spacing[3] }}>
              Component Showcase
            </DSText>

            {/* Badges */}
            <DSText variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: spacing[2] }}>
              Badges
            </DSText>
            <Stack direction="row" spacing={spacing[2]} wrap style={{ marginBottom: spacing[4] }}>
              <Badge label="Default" variant="default" />
              <Badge label="Success" variant="success" />
              <Badge label="Error"   variant="error" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Info"    variant="info" />
            </Stack>

            {/* Buttons */}
            <DSText variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: spacing[2] }}>
              Button Variants
            </DSText>
            <Stack direction="column" spacing={spacing[2]} style={{ marginBottom: spacing[4] }}>
              <Button label="Primary Button"   variant="primary"   size="md" />
              <Button label="Secondary Button" variant="secondary" size="md" />
              <Button label="Outline Button"   variant="outline"   size="md" />
              <Button label="Ghost Button"     variant="ghost"     size="md" />
              <Button label="Loading State"    variant="primary"   size="md" loading />
              <Button label="Disabled State"   variant="primary"   size="md" disabled />
            </Stack>

            {/* Button sizes */}
            <DSText variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: spacing[2] }}>
              Button Sizes
            </DSText>
            <Stack direction="column" spacing={spacing[2]}>
              <Button label="Large"  variant="primary" size="lg" />
              <Button label="Medium" variant="primary" size="md" />
              <Button label="Small"  variant="primary" size="sm" />
            </Stack>
          </Card>

          {/* ── Typography showcase ── */}
          <Card variant="default" style={{ marginTop: spacing[4], marginBottom: spacing[8] }}>
            <DSText variant="h4" weight="bold" style={{ marginBottom: spacing[3] }}>
              Typography
            </DSText>
            <Stack direction="column" spacing={spacing[2]}>
              <DSText variant="h1" weight="bold">Heading 1</DSText>
              <DSText variant="h2" weight="bold">Heading 2</DSText>
              <DSText variant="h3" weight="semibold">Heading 3</DSText>
              <DSText variant="h4" weight="semibold">Heading 4</DSText>
              <DSText variant="body">Body text — regular weight for reading comfort.</DSText>
              <DSText variant="bodySmall">Body Small — supporting content.</DSText>
              <DSText variant="caption">Caption — metadata and footnotes.</DSText>
              <DSText variant="label" weight="medium">Label — form fields and UI elements.</DSText>
            </Stack>
          </Card>

        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};
