// middleware/auth.js
import admin from 'firebase-admin';

// Initialize Firebase Admin (do this once in your app)
import serviceAccount from "../config/task-manager-5928c-firebase-adminsdk-fbsvc-25399d7c4d.json" with {type:'json'};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    // console.log(token); 
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; // Add user info to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

