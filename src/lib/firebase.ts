
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
let initializationError = null;

const initializeFirebase = async (retryAttempt = 0) => {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
    initializationError = null;
    return { app, db };
  } catch (error) {
    console.error(`Error initializing Firebase (attempt ${retryAttempt + 1}):`, error);
    initializationError = error;
    
    if (retryAttempt < 2) {
      console.log(`Retrying Firebase initialization (attempt ${retryAttempt + 2})...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return initializeFirebase(retryAttempt + 1);
    } else {
      throw new Error("Failed to initialize Firebase after multiple attempts");
    }
  }
};

// Perform initial initialization
initializeFirebase().catch(error => {
  console.error("Firebase initialization failed after all retry attempts:", error);
});

// Export a function to manually retry initialization
export const retryFirebaseInitialization = async () => {
  console.log("Manually retrying Firebase initialization...");
  return initializeFirebase();
};

export { db, initializationError };
export default app;
