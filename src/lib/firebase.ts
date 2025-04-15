
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export default app;
