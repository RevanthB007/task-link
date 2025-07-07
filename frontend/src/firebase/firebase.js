import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';

import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrf09SA85GzrACradw8rWSNrBVBLjaHJ4",
  authDomain: "task-manager-5928c.firebaseapp.com",
  projectId: "task-manager-5928c",
  storageBucket: "task-manager-5928c.firebasestorage.app",
  messagingSenderId: "256384153833",
  appId: "1:256384153833:web:3a104d43c9b4a2d007d878",
  measurementId: "G-JYCFKFPLYX"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
