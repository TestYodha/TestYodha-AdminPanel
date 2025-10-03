// // src/components/ProtectedRoute.jsx
// import React, { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   return currentUser ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;



// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
