import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import VeriChainLogo from "../../components/VeriChainLogo";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const userData = response.data.data.user;
      const token = response.data.data.token;

      localStorage.setItem("token", token);

      login(userData, token);

      toast.success("Welcome back!");

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      }

      if (userData.role === "user") {
        navigate("/user/dashboard");
      }

      if (userData.role === "verifier") {
        navigate("/verifier/dashboard");
      }

      if (userData.role === "thirdparty") {
        navigate("/thirdparty/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#1c1700 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-dark-3 border border-dark-border rounded-2xl p-8">
          <div className="mb-8">
            <VeriChainLogo size={34} />
          </div>

          <h2 className="text-xl font-medium text-[#e8e0cc] mb-1">
            Sign in
          </h2>

          <p className="text-[#555] text-sm mb-6">
            Decentralized identity verification
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="input-field"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="input-field"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-gold w-full justify-center mt-5 py-3 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#555] mt-5">
            No account?{" "}
            <Link
              to="/register"
              className="text-gold hover:opacity-80 transition"
            >
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-[#333] text-xs mt-4">
          Secured by Ethereum · SHA-256 Hashing
        </p>
      </motion.div>
    </div>
  );
}