// import React, { useEffect } from 'react'
// import useStore from './store/todoStore'
// import { useState } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import "./index.css"
// import { Analytics } from './pages/Analytics.jsx'; 
// import { Dashboard } from './pages/Dashboard.jsx';
// import { Organizations } from './pages/Organizations.jsx';
// import { Sidebar } from './components/Sidebar.jsx';
// import { AuthProvider, useAuth } from './store/auth.store.jsx';
// import { Login } from './pages/Login.jsx';
// import { Signup } from './pages/SignUp.jsx';
// import { AI } from './pages/AI.jsx';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/login" />;
// };

// // Public Route Component (redirects to dashboard if already logged in)
// const PublicRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return !currentUser ? children : <Navigate to="/dashboard" />;
// };

// // Main App Layout Component
// const AppLayout = () => {
//   const { currentUser,loading } = useAuth();
//   const location = useLocation();
  
//   // Define routes that shouldn't show sidebar
//   const authRoutes = ['/login', '/signup'];
//   const shouldShowSidebar = currentUser && !authRoutes.includes(location.pathname);

//   useEffect(() => {loading?{}:console.log(currentUser?.email)}, [currentUser])

//   return (
//     <div className={`flex flex-row gap-2 ${shouldShowSidebar ? '' : 'w-full'}`}>
//       {/* Conditionally render sidebar */}
//       {shouldShowSidebar && <Sidebar />}
      
//       {/* Main content area */}
//       <div className={`flex-1 ${shouldShowSidebar ? '' : 'w-full'}`}>
//         <Routes>
//           {/* Public Routes */}
//           <Route 
//             path="/login" 
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             } 
//           />
//           <Route 
//             path="/signup" 
//             element={
//               <PublicRoute>
//                 <Signup />
//               </PublicRoute>
//             } 
//           />
          
//           {/* Protected Routes */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/analytics" 
//             element={
//               <ProtectedRoute>
//                 <Analytics />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/organizations" 
//             element={
//               <ProtectedRoute>
//                 <Organizations />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/settings" 
//             element={
//               <ProtectedRoute>
//                 <div>Settings</div>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/AI" 
//             element={
//               <ProtectedRoute>
//                 <AI />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Default redirects */}
//           <Route 
//             path="/" 
//             element={
//               currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
//             } 
//           />
          
//           {/* Catch all route */}
//           <Route 
//             path="*" 
//             element={
//               currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
//             } 
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export const App = () => {

//   return (
//     <AuthProvider>
//       <AppLayout className="overflow-hidden"/>
//     </AuthProvider>
//   );
// };

import React, { useEffect } from 'react'
import useStore from './store/todoStore'
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Add this import
import "./index.css"
import { Analytics } from './pages/Analytics.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Organizations } from './pages/Organizations.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { AuthProvider, useAuth } from './store/auth.store.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/SignUp.jsx';
import { AI } from './pages/AI.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

// Main App Layout Component
const AppLayout = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Define routes that shouldn't show sidebar
  const authRoutes = ['/login', '/signup'];
  const shouldShowSidebar = currentUser && !authRoutes.includes(location.pathname);

  useEffect(() => {
    loading ? {} : console.log(currentUser?.email)
  }, [currentUser])

  return (
    <div className={`flex flex-row gap-2 ${shouldShowSidebar ? '' : 'w-full'}`}>
      {/* Conditionally render sidebar */}
      {shouldShowSidebar && <Sidebar />}
      
      {/* Main content area */}
      <div className={`flex-1 ${shouldShowSidebar ? '' : 'w-full'}`}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizations" 
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div>Settings</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/AI" 
            element={
              <ProtectedRoute>
                <AI />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirects */}
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
      
      {/* Add Toaster component here */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            zIndex: 9999,
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppLayout className="overflow-hidden"/>
    </AuthProvider>
  );
};