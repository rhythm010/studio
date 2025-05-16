import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA6hH7MBs1f_V8RANuczTuxxLLl942uoDE",
  authDomain: "pagepilot-pwa.firebaseapp.com",
  databaseURL: "https://pagepilot-pwa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pagepilot-pwa",
  storageBucket: "pagepilot-pwa.firebasestorage.app",
  messagingSenderId: "760549596775",
  appId: "1:760549596775:web:69bb3a78f8ada43086fec2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication and database instances
export const auth = getAuth(app);
export const database = getDatabase(app);