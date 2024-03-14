// Import the functions you need from the SDKs you need
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCWyi9nuQ4cvUyZArLrU-b4aZPPSq7znKc",
  authDomain: "lsasp-314e2.firebaseapp.com",
  projectId: "lsasp-314e2",
  storageBucket: "lsasp-314e2.appspot.com",
  messagingSenderId: "606817217423",
  appId: "1:606817217423:web:c51028e538c43ef30f79fa",
  measurementId: "G-PG7S7H5404"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db,  app, storage };