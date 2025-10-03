// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';
// import UploadTest from './pages/UploadTest';
// import UploadPYQ from './pages/UploadPYQ';
// import UploadMaterials from './pages/UploadMaterials';
// import Results from './pages/Results';
// import Dashboard from './pages/Dashboard';

// function PrivateRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;  // Optional: Loading spinner here
//   return user ? children : <Navigate to="/login" replace />;
// }

// function AppWrapper() {
//   const location = useLocation();
//   const hideNavbarPaths = ['/login'];  // Jahan navbar nahi chahiye
//   const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

//   return (
//     <>
//       {shouldShowNavbar && <Navbar />}
//       <Routes>
//         {/* Redirect root path to /login */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//         <Route path="/upload-test" element={<PrivateRoute><UploadTest /></PrivateRoute>} />
//         <Route path="/upload-pyq" element={<PrivateRoute><UploadPYQ /></PrivateRoute>} />
//         <Route path="/upload-materials" element={<PrivateRoute><UploadMaterials /></PrivateRoute>} />
//         <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />

//         {/* Optional: 404 Page */}
//         {/* <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 Page Not Found</h2>} /> */}
//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <AppWrapper />
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Existing Pages
import Login from './pages/Login';
import UploadTest from './pages/UploadTest';
import UploadPYQ from './pages/UploadPYQ';
import UploadMaterials from './pages/UploadMaterials';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';

// 🆕 New Pages
import AddCourse from './pages/AddCourse';
import CreatePlan from './pages/CreatePlan';
import AssignSubscription from './pages/AssignSubscription';
import WithdrawalRequests from "./pages/WithdrawalRequests";
import Leaderboard from "./pages/Leaderboard";
import CarouselManager from "./pages/CarouselManager";
import DeleteCourse from './pages/DeleteCourse';
import ManageCoupons from './pages/ManageCoupons';


function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;  // Show loader if needed
  return user ? children : <Navigate to="/login" replace />;
}

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload-test" element={<PrivateRoute><UploadTest /></PrivateRoute>} />
        <Route path="/upload-pyq" element={<PrivateRoute><UploadPYQ /></PrivateRoute>} />
        <Route path="/upload-materials" element={<PrivateRoute><UploadMaterials /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />

        {/* ✅ New routes for subscription system */}
        <Route path="/add-course" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
        <Route path="/create-plan" element={<PrivateRoute><CreatePlan /></PrivateRoute>} />
        <Route path="/assign-subscription" element={<PrivateRoute><AssignSubscription /></PrivateRoute>} />
        <Route path="/withdrawal-requests" element={<PrivateRoute><WithdrawalRequests /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/carousel-manager" element={<PrivateRoute><CarouselManager /></PrivateRoute>} />
        <Route path="/delete-course" element={<PrivateRoute><DeleteCourse /></PrivateRoute>} />
        <Route path="/coupons" element={<PrivateRoute><ManageCoupons /></PrivateRoute>} />


      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppWrapper />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
