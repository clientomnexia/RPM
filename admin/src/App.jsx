import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/ManageProducts';
import ManageFranchise from './pages/ManageFranchise';
import ManageOrders from './pages/ManageOrders';
import ManageMessages from './pages/ManageMessages';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/franchise" element={<ManageFranchise />} />
            <Route path="/orders" element={<ManageOrders />} />
            <Route path="/messages" element={<ManageMessages />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
