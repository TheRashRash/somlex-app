import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar, IconButton } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { useAuthStore } from '../store/authStore';
import { validateLoginForm } from '../utils/validation';
import { AuthScreenProps, AuthFormData } from '../types';

export const LoginScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const { signIn, loading, error, clearError } = useAuthStore();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  const handleLogin = async () => {
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await signIn(formData.email.trim().toLowerCase(), formData.password);
    } catch (authError) {
      // Error is handled by the store
      setSnackbarVisible(true);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword', { email: formData.email });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text variant="headlineMedium" style={styles.title}>
              Soo Dhawoow - Welcome Back
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Akoonkaaga ku soo gal - Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              
              <TextInput
                label="Furaha Sirta - Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                style={styles.input}
                error={!!errors.password}
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Button
                mode="text"
                onPress={handleForgotPassword}
                style={styles.forgotButton}
                disabled={loading}
              >
                Ma iloobtay furaha sirta? - Forgot password?
              </Button>
              
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                labelStyle={styles.buttonLabel}
              >
                Soo Gal - Sign In
              </Button>
            </Card.Content>
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text variant="bodyMedium" style={styles.registerText}>
              Akooni ma lihid? - Don't have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
              labelStyle={styles.linkText}
            >
              Akoon Cusub - Sign Up
            </Button>
          </View>
        </ThemedView>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible && !!error}
        onDismiss={() => {
          setSnackbarVisible(false);
          clearError();
        }}
        duration={5000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  cardContent: {
    padding: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 12,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    flexWrap: 'wrap',
  },
  registerText: {
    color: '#666',
  },
  linkText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});
