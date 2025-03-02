// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Firebase Authentication
import { getDatabase } from "firebase/database";  // Realtime Database
import { getStorage } from "firebase/storage";  // Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCWq4P3yMa8Qj_g2ytKlGNfYx3BpQDoa0",
  authDomain: "flavorfushion-53f7c.firebaseapp.com",
  projectId: "flavorfushion-53f7c",
  storageBucket: "flavorfushion-53f7c.firebasestorage.app",
  messagingSenderId: "711785953206",
  appId: "1:711785953206:web:3c2afec284dbae619b7317",
  measurementId: "G-E2RVEKRB1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Firebase Authentication instance
const rtdb = getDatabase(app);  // Realtime Database instance
const storage = getStorage(app);  // Firebase Storage instance

// Export the services
export { auth, rtdb, storage };  // Make sure only rtdb is exported, not db
