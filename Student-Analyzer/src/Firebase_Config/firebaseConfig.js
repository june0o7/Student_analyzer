// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJH-aab4UBFNPIBfi0OB0VvVD7pBGAyfc",
  authDomain: "student-analyzer-3de49.firebaseapp.com",
  projectId: "student-analyzer-3de49",
  storageBucket: "student-analyzer-3de49.firebasestorage.app",
  messagingSenderId: "54999598343",
  appId: "1:54999598343:web:215b40e11d923d506f31a2",
  measurementId: "G-TTSVM8TK9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };