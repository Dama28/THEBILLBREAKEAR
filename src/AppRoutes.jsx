import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplianceInput from './pages/ApplianceInput';
// import PremiumSettings from './pages/PremiumSettings'; 

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/appliances" element={
                <ProtectedRoute>
                    <ApplianceInput />
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
