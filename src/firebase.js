// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";  // Firestore
// import { getAuth } from "firebase/auth";  // Firebase Authentication
// import { getStorage } from "firebase/storage";  // Firebase Storage

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCCWq4P3yMa8Qj_g2ytKlGNfYx3BpQDoa0",
//   authDomain: "flavorfushion-53f7c.firebaseapp.com",
//   projectId: "flavorfushion-53f7c",
//   storageBucket: "flavorfushion-53f7c.firebasestorage.app",
//   messagingSenderId: "711785953206",
//   appId: "1:711785953206:web:3c2afec284dbae619b7317",
//   measurementId: "G-E2RVEKRB1Q"
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize services
// const db = getFirestore(app);  // Firestore instance
// const auth = getAuth(app);  // Authentication instance
// const storage = getStorage(app);  // Firebase Storage instance

// // Export services
// export { db, auth, storage };

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore
import { getAuth } from "firebase/auth";  // Firebase Authentication
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
const db = getFirestore(app);  // Firestore instance
const auth = getAuth(app);  // Authentication instance
const storage = getStorage(app);  // Firebase Storage instance

export { db, auth, storage };
