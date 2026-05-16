import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data.data.user;

      login(userData);
      toast.success("Login successful");

      if (userData.role === "admin") navigate("/admin/dashboard");
      if (userData.role === "user") navigate("/user/dashboard");
      if (userData.role === "verifier") navigate("/verifier/dashboard");
      if (userData.role === "thirdparty") navigate("/thirdparty/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-3xl p-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Veri<span className="text-secondary">Chain</span>
        </h1>

        <p className="text-gray-400 mb-8">
          Blockchain Identity Verification Platform
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-primary hover:opacity-90 transition p-4 rounded-xl font-semibold"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}