//============================================
//? Import 
// ============================================
import './styles/index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useEffect } from 'react';

import { useAppDispatch } from './redux/hooks';
import { setUser, clearUser, stopLoading, setError } from './redux/slices/authSlice';

import { apiClient } from './shared/services/apiClient';

import DashboardLayout from './admin/shared/layout/appLayout';
import StudentLayout from './student/shared/layout/studentLayout';

// auth pages --------------------------------
import Login from './Login';
import ProtectedRoute from './shared/components/auth/ProtectedRoute';

// Admin - protected pages ---------------------------------------
import AdminDashboard from './admin/dashboard/dashboard';
import StudentsPage from './admin/students/students';
import CoursesPage from './admin/courses/page/courses';
import OfferedCoursesPage from './admin/offeredCourses/offeredCourses';
import SemestersPage from './admin/semesters/semesters';

// Student - protected pages ---------------------------------------
import StudentHomepage from './student/homepage/components/StudentHomepage';
import MyCoursesPage from './student/courses/pages/myCoursesPage';
import AddCoursePage from './student/courses/pages/addCoursePage';
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
      },
      {
        path: "students",
        element: <StudentsPage />
      },
      {
        path: "courses",
        element: <CoursesPage />
      },
      {
        path: "offered-courses",
        element: <OfferedCoursesPage />
      },
      {
        path: "semesters",
        element: <SemestersPage />
      }
    ]

  },
  // studnet ----------------------------
  {
    path: "/student",
    element: <ProtectedRoute targetRole="student"> <StudentLayout />  </ProtectedRoute>,
    children: [
      {
        path: "homepage",
        element: <StudentHomepage />
      },
      {
        path: "courses",
        element: <MyCoursesPage />
      },
      {
        path: "courses/add",
        element: <AddCoursePage />
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
      if (!localStorage.getItem('isLoggedIn')) { // check for 'isLoggedIn' flag in local storage, if found we skip the /api/auth/user API call entirely        dispatch(clearUser());
        dispatch(stopLoading());
        return;
      }

      try {
        const response = await apiClient.get('/api/auth/user');
        const userData = response.data.data;

        dispatch(setUser(userData));

        // ============================================================
      } catch (error) {
        localStorage.removeItem('isLoggedIn');
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