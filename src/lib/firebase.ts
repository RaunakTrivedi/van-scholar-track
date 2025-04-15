
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK3cMykfGV_U0grObqlcxZH88D8rOOSaw",
  authDomain: "van-project-b202f.firebaseapp.com",
  projectId: "van-project-b202f",
  storageBucket: "van-project-b202f.firebasestorage.app",
  messagingSenderId: "862119740473",
  appId: "1:862119740473:web:92633eef91a602f4d4b9e8",
  measurementId: "G-4M8GSQMXM2"
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
