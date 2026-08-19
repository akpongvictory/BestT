import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Study from "../pages/Study";
import Quiz from "../pages/Quiz";

import ProtectedRoute from "./ProtectedRoute";
import Chat from "../pages/Chat";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public experience */}
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected application */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />



      <Route
        path="/study/:courseId"
        element={
          <ProtectedRoute>
            <Study />
          </ProtectedRoute>
        }
      />

              <Route
      path="/study/:courseId/chat"
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    />

      <Route
        path="/quiz/:courseId"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}