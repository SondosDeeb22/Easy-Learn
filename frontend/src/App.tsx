//============================================
//? Import 
// ============================================
import './styles/index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";


import DashboardLayout from './layout/dashboardLayout';

import ProtectedRoute from './components/common/auth/ProtectedRoute';
// auth pages --------------------------------
import Login from './Login';

// protected pages ---------------------------------------
import Dashboard from './pages/dashboard';


import { useEffect } from 'react';

import { useAppDispatch } from './redux/hooks';
import { setUser, clearUser, stopLoading } from './redux/slices/authSlice';

import { apiClient } from './services/apiClient';

// ========================================================================

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,

  },
  {
    path: "/",
    element: <ProtectedRoute> <DashboardLayout /> </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      }
    ]

  }
])

const App = () => {
  const dispatch = useAppDispatch();

  // check if the user is authenticated or not
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const response = await apiClient.get('/auth/user');
        dispatch(setUser(response.data.data));

      } catch (error) {
        dispatch(clearUser());

      } finally {
        dispatch(stopLoading());
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  return <RouterProvider router={router} />

}
// =======================================
export default App;