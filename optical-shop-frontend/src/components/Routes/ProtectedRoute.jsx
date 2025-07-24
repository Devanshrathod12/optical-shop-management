import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';

const ProtectedRoute = () => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;