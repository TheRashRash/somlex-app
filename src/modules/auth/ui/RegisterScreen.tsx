import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar, IconButton, ProgressBar } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { useAuthStore } from '../store/authStore';
import { validateRegisterForm, getPasswordStrength, getPasswordStrengthText } from '../utils/validation';
import { AuthScreenProps, AuthFormData } from '../types';

export const RegisterScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const { signUp, loading, error, clearError } = useAuthStore();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  const handleRegister = async () => {
    const validation = validateRegisterForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await signUp(formData.email.trim().toLowerCase(), formData.password);
    } catch (authError) {
      // Error is handled by the store
      setSnackbarVisible(true);
    }
  };

  // Password strength indicator
  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;
  const strengthColor = passwordStrength === 'strong' ? '#4caf50' : passwordStrength === 'medium' ? '#ff9800' : '#f44336';
  const strengthProgress = passwordStrength === 'strong' ? 1 : passwordStrength === 'medium' ? 0.6 : 0.3;

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
              Akoon Cusub - Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Ku biir bulshadayada barashada - Join our learning community
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
                autoComplete="password-new"
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

              {/* Password Strength Indicator */}
              {formData.password && passwordStrength && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthHeader}>
                    <Text variant="bodySmall" style={styles.strengthLabel}>
                      Xoogga furaha - Password strength:
                    </Text>
                    <Text variant="bodySmall" style={[styles.strengthText, { color: strengthColor }]}>
                      {getPasswordStrengthText(passwordStrength)}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={strengthProgress}
                    color={strengthColor}
                    style={styles.strengthBar}
                  />
                </View>
              )}
              
              <TextInput
                label="Xaqiiji Furaha - Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                style={styles.input}
                error={!!errors.confirmPassword}
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {/* Terms Notice */}
              <Text variant="bodySmall" style={styles.termsText}>
                Marka aad abuurto akoon, waxaad ogolaanaysaa shuruudaha adeegga
                {'\n'}
                By creating an account, you agree to our terms of service
              </Text>
              
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                labelStyle={styles.buttonLabel}
              >
                Abuur Akoon - Create Account
              </Button>
            </Card.Content>
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text variant="bodyMedium" style={styles.loginText}>
              Akoon ma leedahay horay? - Already have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
              labelStyle={styles.linkText}
            >
              Soo Gal - Sign In
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
    marginBottom: 30,
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
  strengthContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  strengthLabel: {
    color: '#666',
  },
  strengthText: {
    fontWeight: '600',
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    flexWrap: 'wrap',
  },
  loginText: {
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
