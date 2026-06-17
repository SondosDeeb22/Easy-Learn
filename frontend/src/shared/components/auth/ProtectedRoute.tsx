//====================================================================================================================================
//? Import
//====================================================================================================================================
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../../../redux/hooks';

interface ProtectedRouteProps {
    targetRole: string
    children: React.ReactNode;
}

//====================================================================================================================================
//? protects routes based on authentication and authorization
//====================================================================================================================================


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ targetRole, children }) => {

    // state from redux --------------------------
    const user = useAppSelector((state) => state.auth);

    // Show loading state while checking authentication
    if (user.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated or not authorized as admin
    if (!user.isAuthenticated || user.userRole !== targetRole) {
        return <Navigate to="/" replace />;
    }

    // If authenticated and authorized, render children
    return <>{children}</>;
};

export default ProtectedRoute;
