import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import AuthForm from "./component/form";
import Home from "./component/home";
import MedicineInfo from "./component/medicineInfo";
import Header from "./component/header";
import Footer from "./component/footer";
import "./index.css";
import "./App.css";
import AdvancedLoader from "./component/loading";
// Layout with Header
const LayoutWithHeader = ({ Theme, setTheme }) => (
  <>
    <Header Theme={Theme} setTheme={setTheme} />
    <Outlet />
   <Footer Theme={Theme}/>
  </>
);

// Auth Guard: Only for authenticated users
const ProtectedRoute = ({ Theme, setTheme }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <AdvancedLoader message="Loading..."/>;
  return user ? (
    <LayoutWithHeader Theme={Theme} setTheme={setTheme} />
  ) : (
    <Navigate to="/login" />
  );
};

// Public Only: for login page only
const PublicOnlyRoute = ({ Theme, setTheme }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <AdvancedLoader message="Loading..."/>;
  return !user ? (
    <AuthForm Theme={Theme} setTheme={setTheme} />
  ) : (
    <Navigate to="/admin" />
  );
};

const AppWrapper = () => {
  const [Theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "true";
  });

  useEffect(() => {
    localStorage.setItem("theme", Theme);
    document.body.className = Theme ? "dark" : "light"; // Optional class
  }, [Theme]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <PublicOnlyRoute Theme={Theme} setTheme={setTheme} />,
    },
    {
      path: "/admin",
      element: <ProtectedRoute Theme={Theme} setTheme={setTheme} />,
      children: [
        {
          path: "",
          element: <Home Theme={Theme} setTheme={setTheme} />,
        },
        {
          path: "medicine/:id",
          element: <MedicineInfo Theme={Theme} setTheme={setTheme} />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
