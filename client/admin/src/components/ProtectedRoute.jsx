import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
    const { admin } = useAuth();

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;
