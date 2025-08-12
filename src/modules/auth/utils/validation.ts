import { AuthFormData, AuthValidationResult } from '../types';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Emailka waa lagama maarmaan - Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Emailka wuu qaldan yahay - Please enter a valid email';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Furaha sirta ah waa lagama maarmaan - Password is required';
  }
  
  if (password.length < 6) {
    return 'Furaha sirta ahi waa inuu ka badan yahay 6 xaraf - Password must be at least 6 characters';
  }
  
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Xaqiijinta furaha sirta ah waa lagama maarmaan - Confirm password is required';
  }
  
  if (password !== confirmPassword) {
    return 'Furaha sirta ah iyo xaqiijintiisu way kala duwan yihiin - Passwords do not match';
  }
  
  return null;
};

export const validateLoginForm = (formData: AuthFormData): AuthValidationResult => {
  const errors: AuthValidationResult['errors'] = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (formData: AuthFormData): AuthValidationResult => {
  const errors: AuthValidationResult['errors'] = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (formData.confirmPassword !== undefined) {
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (criteriaCount >= 3) return 'strong';
  if (criteriaCount >= 2) return 'medium';
  return 'weak';
};

export const getPasswordStrengthText = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak':
      return 'Daciif - Weak';
    case 'medium':
      return 'Dhexdhexaad - Medium';
    case 'strong':
      return 'Xoog badan - Strong';
  }
};
