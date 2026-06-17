//============================================
//? Import 
// ============================================
import './styles/index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useEffect } from 'react';

import { useAppDispatch } from './redux/hooks';
import { setUser, clearUser, stopLoading, setError } from './redux/slices/authSlice';

import { apiClient } from './shared/services/apiClient';

import DashboardLayout from './admin/layout/dashboardLayout';
import StudentLayout from './student/layout/studentLayout';

// auth pages --------------------------------
import Login from './Login';
import ProtectedRoute from './shared/components/auth/ProtectedRoute';

// Admin - protected pages ---------------------------------------
import AdminDashboard from './admin/pages/adminDashboard';

// Student - protected pages ---------------------------------------
import StudentDashboard from './student/pages/studentDashboard';
import MyCourses from './student/pages/myCourses';
// ========================================================================

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,

  },
  {
    path: "/admin",
    element: <ProtectedRoute targetRole="admin"> <DashboardLayout /> </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />
      }
    ]

  },
  // studnet ----------------------------
  {
    path: "/student",
    element: <ProtectedRoute targetRole="student">
      <StudentLayout />
    </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />
      },
      {
        path: "courses",
        element: <MyCourses />
      }
    ]
  }
])
// ============================================================

const App = () => {
  const dispatch = useAppDispatch();

  // check if the user is authenticated or not
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const response = await apiClient.get('/api/auth/user');
        const userData = response.data.data;


        dispatch(setUser(userData));


        // ============================================================
      } catch (error) {
        dispatch(clearUser());
        // ============================================================
      } finally {
        dispatch(stopLoading());
      }
    };
    // ============================================================

    bootstrapAuth();
  }, []);

  return <RouterProvider router={router} />

}
// =======================================
export default App;