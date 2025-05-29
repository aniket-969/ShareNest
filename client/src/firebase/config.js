import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_VITE_API,
  authDomain: import.meta.env.FIREBASE_VITE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_VITE_PROJECT_ID,
  storageBucket:import.meta.env.FIREBASE_VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_VITE_APP_ID,
  measurementId: import.meta.env.FIREBASE_VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app)