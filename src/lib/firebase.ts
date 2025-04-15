
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Use Firebase emulator in development if needed
if (import.meta.env.DEV) {
  try {
    // Uncomment the following line to use the emulator
    // connectFirestoreEmulator(db, 'localhost', 8080);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error connecting to Firebase:", error);
  }
}

export default app;
