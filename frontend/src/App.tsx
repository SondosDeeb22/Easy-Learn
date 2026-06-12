//============================================
//? Import 
// ============================================
import './index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";


// auth pages --------------------------------
import Login from './Login';

// protected pages ---------------------------------------
import Dashboard from './pages/dashboard';
// ============================================

export default function App() {
  return <Login />;
}


// const route = createBrowserRouter([
//   {
//     path: "/",
//     element: <Login />,

//   },
//   {
//     path: "/",

//   }
// ])