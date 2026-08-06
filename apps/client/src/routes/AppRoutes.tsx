import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Study from "../pages/Study";
import Quiz from "../pages/Quiz";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

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