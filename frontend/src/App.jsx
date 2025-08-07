import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LayoutProvider } from "./store/useLayout.jsx";
import { ThemeProvider } from "./components/theme-provider";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Profilepage from "./pages/Profilepage";
import Settingspage from "./pages/Settingspage";
import { useEffect } from "react";
import { useAuth } from "./store/useAuth";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <ThemeProvider defaultTheme="light" storageKey="chatty-ui-theme">
      <LayoutProvider>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <Loginpage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signuppage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profilepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser ? <Settingspage /> : <Navigate to="/login" />}
          />
        </Routes>
      </LayoutProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
