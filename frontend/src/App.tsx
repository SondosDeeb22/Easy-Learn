//============================================
//? Import 
// ============================================
import './styles/index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useEffect } from 'react';

import { useAppDispatch } from './redux/hooks';
import { setUser, clearUser, stopLoading, setError } from './redux/slices/authSlice';

import { apiClient } from './services/apiClient';

import DashboardLayout from './layout/dashboardLayout';

// auth pages --------------------------------
import Login from './Login';
import ProtectedRoute from './components/common/auth/ProtectedRoute';

// Admin - protected pages ---------------------------------------
import AdminDashboard from './pages/admin/adminDashboard';

// Student - protected pages ---------------------------------------
import StudentDashboard from './pages/student/studentDashboard';


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
      <DashboardLayout />
    </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />
      }
    ]
  }
])
// ============================================================
// ============================================================
// const App = () => {
//   const dispatch = useAppDispatch();

//   // check if the user is authenticated or not
//   useEffect(() => {
//     const bootstrapAuth = async () => {
//       try {
//         const targetRole: string = "admin"
//         const response = await apiClient.get('/auth/user');
//         const userData = response.data.data;

//         if (userData && userData.role !== targetRole) {
//           await apiClient.post('/auth/logout', {});
//           dispatch(clearUser());
//           dispatch(setError("Sorry, you are not authorized to perform this action!"));
//           // ----------------------
//         } else {
//           dispatch(setUser(userData));
//         }

//         // ============================================================
//       } catch (error) {
//         dispatch(clearUser());
//         // ============================================================
//       } finally {
//         dispatch(stopLoading());
//       }
//     };
//     // ============================================================

//     bootstrapAuth();
//   }, [dispatch]);

const App = () => {
  const dispatch = useAppDispatch();

  // check if the user is authenticated or not
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const targetRole: string = "admin"
        const response = await apiClient.get('/auth/user');
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