import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';

type AuthScreen = 'welcome' | 'login' | 'register';

export const AuthFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('welcome');

  const navigation = {
    navigate: (screen: string) => {
      switch (screen) {
        case 'Login':
          setCurrentScreen('login');
          break;
        case 'Register':
          setCurrentScreen('register');
          break;
        case 'Welcome':
          setCurrentScreen('welcome');
          break;
        default:
          setCurrentScreen('welcome');
      }
    },
    goBack: () => {
      setCurrentScreen('welcome');
    }
  };

  switch (currentScreen) {
    case 'login':
      return <LoginScreen navigation={navigation} />;
    case 'register':
      return <RegisterScreen navigation={navigation} />;
    default:
      return <WelcomeScreen navigation={navigation} />;
  }
};
