
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDofmDJMb_h0Y1EPl_lDwDgV_UpQnXl1H8",
  authDomain: "school-van-manager.firebaseapp.com",
  projectId: "school-van-manager",
  storageBucket: "school-van-manager.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:123456789abcdef"
};

// Initialize Firebase with retry mechanism
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase");
}

export { db };
export default app;
