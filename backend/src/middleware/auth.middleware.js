// middleware/auth.js
// import admin from 'firebase-admin';

// Initialize Firebase Admin (do this once in your app)
// import serviceAccount from "../config/task-manager-5928c-firebase-adminsdk-fbsvc-25399d7c4d.json" with {type:'json'};
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// export const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log("Auth header received:", authHeader ? "YES" : "NO");
    
//     const token = authHeader?.split(' ')[1];
//     console.log("Token extracted:", token ? "YES" : "NO");

//     if (!token) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const decodedToken = await admin.auth().verifyIdToken(token);
//     console.log("Token verified for user:", decodedToken.uid);
    
//     req.user = { uid: decodedToken.uid };
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error.message);
//     res.status(401).json({ error: 'Invalid token', details: error.message });
//   }
// };

let admin;
try {
  const firebaseModule = await import("../config/firebase.js");
  admin = firebaseModule.admin;
  console.log('Admin imported:', !!admin);
} catch (error) {
  console.error('Failed to import Firebase admin:', error);
}

export const verifyToken = async (req, res, next) => {
  // console.log('Admin in middleware:', !!admin);
  // console.log('Admin auth method:', !!admin.auth);
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Use the imported admin here
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ 
      error: 'Invalid token', 
      details: error.message 
    });
  }
};

