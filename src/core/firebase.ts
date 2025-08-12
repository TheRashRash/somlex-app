import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

// Firebase configuration from Expo Constants
const firebaseConfig = Constants?.expoConfig?.extra?.firebase;

if (!firebaseConfig) {
  throw new Error(
    "Firebase configuration not found. Please ensure you have set up your Firebase config in app.config.js"
  );
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);
