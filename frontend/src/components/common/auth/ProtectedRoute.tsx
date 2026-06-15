//====================================================================================================================================
//? Import
//====================================================================================================================================
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setError } from '../../../redux/slices/authSlice';
// -----
interface ProtectedRouteProps {
    children: React.ReactNode;
}


//====================================================================================================================================
//? protects routes based on authentication
//====================================================================================================================================


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    const authroizedRole = "admin";

    // state from redux --------------------------
    const user = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    // --------------------------------------------------------------

    // Show loading state while checking authentication
    if (user.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                    <p className="text-gray-600">{'protectedRoute.loading'}</p>
                </div>
            </div>
        );
    }


    // Redirect to login if not authenticated
    if (!user.isAuthenticated) {
        return <Navigate to="/" replace />;

    }

    // redicretct to login if user not authorized
    if (user.userRole != authroizedRole && user.userRole != "") {
        dispatch(setError("Sorry, you are not authorized to perform this action!"));
        return <Navigate to="/" replace />;

    }

    // If authenticated, render children
    return <>{children}</>;
};

export default ProtectedRoute;
