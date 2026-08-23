import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Study from "../pages/Study";
import Chat from "../pages/Chat";
import Quiz from "../pages/Quiz";
import Resources from "../pages/Resources";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Upload from "../pages/Upload";

import ProtectedRoute from "./ProtectedRoute";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

      {/* =====================================================
          PROTECTED APPLICATION ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Resources */}
        <Route
          path="/resources"
          element={<Resources />}
        />

        {/* Upload */}
        <Route
          path="/upload"
          element={<Upload />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* =================================================
            COURSE ROUTES
        ================================================= */}

        <Route
          path="/study/:courseId"
          element={<Study />}
        />

        <Route
          path="/study/:courseId/chat"
          element={<Chat />}
        />

        <Route
          path="/quiz/:courseId"
          element={<Quiz />}
        />
      </Route>

      {/* =====================================================
          UNKNOWN ROUTES
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
