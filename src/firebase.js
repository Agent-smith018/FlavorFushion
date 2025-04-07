// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary methods

const firebaseConfig = {
  apiKey: "AIzaSyCCWq4P3yMa8Qj_g2ytKlGNfYx3BpQDoa0",
  authDomain: "flavorfushion-53f7c.firebaseapp.com",
  projectId: "flavorfushion-53f7c",
  storageBucket: "flavorfushion-53f7c.appspot.com",
  messagingSenderId: "711785953206",
  appId: "1:711785953206:web:3c2afec284dbae619b7317",
  measurementId: "G-E2RVEKRB1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

// Export Firebase services and methods
export { auth, rtdb, storage, ref, uploadBytes, getDownloadURL };
