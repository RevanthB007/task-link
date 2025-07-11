import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load environment variables
dotenv.config();

let db;
let auth;
let firebaseAdmin;

const initializeFirebase = () => {
  if (!admin.apps.length) {
    // Check if environment variables are loaded
    const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
      throw new Error('Firebase configuration missing');
    }

    // Initialize with service account credentials
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      // console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      throw error;
    }
  }
  
  // Return the initialized services
  db = admin.firestore();
  auth = admin.auth();
  firebaseAdmin = admin;
  
  return { db, auth, admin: firebaseAdmin };
};

// Initialize Firebase
const { db: firestore, auth: firebaseAuth, admin: exportedAdmin } = initializeFirebase();

export { 
  firestore as db, 
  firebaseAuth as auth, 
  exportedAdmin as admin 
};