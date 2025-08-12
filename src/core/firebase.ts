import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
