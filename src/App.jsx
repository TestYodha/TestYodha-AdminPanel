// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './theme/ThemeProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTestSeries from './pages/AddTestSeries';
import Results from './pages/Results';
import UploadPYQ from './pages/UploadPYQ';
import NotFound from './pages/NotFound';

// ✅ NEW
import ManageCoupons from './pages/ManageCoupons';

const App = () => (
  <CustomThemeProvider>
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-test" element={<ProtectedRoute><AddTestSeries /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/upload-pyq" element={<ProtectedRoute><UploadPYQ /></ProtectedRoute>} />

          {/* ✅ NEW ROUTE */}
          <Route path="/coupons" element={<ProtectedRoute><ManageCoupons /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  </CustomThemeProvider>
);

export default App;
