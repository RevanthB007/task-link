// import { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   sendPasswordResetEmail
// } from 'firebase/auth';
// import { auth } from '../firebase/firebase.js';
// import {useSocketStore} from './socket.store.js';

// const AuthContext = createContext();
// const {connectSocket,disconnectSocket} = useSocketStore();
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Email/Password Authentication Methods
//   const signUpWithEmail = async (email, password) => {
//     try {
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       connectSocket();
//       return result;
//     } catch (error) {
//       console.error('Email signup error:', error);
//       throw error;
//     }
//   };

//   const signInWithEmail = async (email, password) => {
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       connectSocket();
//       return result;
//     } catch (error) {
//       console.error('Email signin error:', error);
//       throw error;
//     }
//   };

//   // Google Authentication Method
//   const signInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       connectSocket();
//       return result;
//     } catch (error) {
//       console.error('Google signin error:', error);
//       throw error;
//     }
//   };

//   // Password Reset
//   const resetPassword = async (email) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       console.error('Password reset error:', error);
//       throw error;
//     }
//   };

//   // Sign Out
//    const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const value = {
//     currentUser,
//     signUpWithEmail,
//     signInWithEmail,
//     signInWithGoogle,
//     resetPassword,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { useSocketStore } from './socket.store.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ✅ Call the hook inside the component
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('🔄 Socket useEffect triggered:', {
      loading,
      currentUser: currentUser?.uid,
      hasInitialized
    });

    if (loading) {
      console.log('⏳ Still loading, skipping...');
      return;
    }

    if (!currentUser) {
      if (hasInitialized) {
        console.log('🔌 Disconnecting socket - user logged out');
        disconnectSocket();
      } else {
        console.log('⏭️ No user on first load, skipping disconnect');
      }
    } else {
      console.log('🔗 Connecting socket for user:', currentUser.uid);
      connectSocket(currentUser);
    }

    if (!hasInitialized) {
      console.log('✅ Marking as initialized');
      setHasInitialized(true);
    }
  }, [currentUser, hasInitialized]);

  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Email signup error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // connectSocket(); // Remove this - it's handled in useEffect
      return result;
    } catch (error) {
      console.error('Email signin error:', error);
      throw error;
    }
  };

 const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Google signin error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the Google sign-in popup');
      return; 
    }
    
    throw error;
  }
};

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};