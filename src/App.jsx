import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Talent from "./pages/Talent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkerDetail from "./pages/WorkerDetail";
import SavedJobs from "./pages/SavedJobs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVerifications from "./pages/AdminVerifications";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public routes — wrapped in Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/talent"
          element={
            <ProtectedRoute role="factory">
              <Talent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workers/:id"
          element={
            <ProtectedRoute role="factory">
              <WorkerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute role="worker">
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes — wrapped in AdminLayout (sidebar, no public Navbar) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="verifications" element={<AdminVerifications />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
