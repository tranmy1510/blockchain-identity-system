import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import UserDashboard from "./pages/user/UserDashboard";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import VerifierIdentityDetail from "./pages/verifier/VerifierIdentityDetail";
import ThirdPartyDashboard from "./pages/thirdparty/ThirdPartyDashboard";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import CreateIdentity from "./pages/user/CreateIdentity";
import TransactionHistory from "./pages/user/TransactionHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlockchainExplorer from "./pages/user/BlockchainExplorer";
import ShareAccess from "./pages/user/ShareAccess";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<DashboardLayout />}>
          <Route
            path="/explorer"
            element={
              <ProtectedRoute allowedRole={["user", "admin"]}>
                <BlockchainExplorer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/history"
            element={
              <ProtectedRoute allowedRole="user">
                <TransactionHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/share-access"
            element={
              <ProtectedRoute allowedRole="user">
                <ShareAccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verifier/dashboard"
            element={
              <ProtectedRoute allowedRole="verifier">
                <VerifierDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verifier/identity/:id"
            element={
              <ProtectedRoute allowedRole="verifier">
                <VerifierIdentityDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/thirdparty/dashboard"
            element={
              <ProtectedRoute allowedRole="thirdparty">
                <ThirdPartyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/create-identity"
            element={
              <ProtectedRoute allowedRole="user">
                <CreateIdentity />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}