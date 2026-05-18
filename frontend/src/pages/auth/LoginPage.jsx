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

<<<<<<< HEAD
  const [email,    setEmail]    = useState("");
=======
  const [email, setEmail] = useState("");

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
<<<<<<< HEAD
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res      = await api.post("/auth/login", { email, password });
      const userData = res.data.data.user;
      login(userData);
      toast.success("Welcome back!");
      if (userData.role === "admin")      navigate("/admin/dashboard");
      if (userData.role === "user")       navigate("/user/dashboard");
      if (userData.role === "verifier")   navigate("/verifier/dashboard");
      if (userData.role === "thirdparty") navigate("/thirdparty/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
=======

    try {

      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const userData = response.data.data.user;

      const token = response.data.data.token;

      // SAVE TOKEN
      localStorage.setItem("token", token);

      // SAVE USER
      login(userData, token);

      toast.success("Login successful");

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

      toast.error(
        error.response?.data?.message || "Login failed"
      );

    } finally {

      setLoading(false);

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">

      {/* subtle grid bg */}
      <div className="fixed inset-0 pointer-events-none"
           style={{ backgroundImage: "radial-gradient(#1c1700 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 }} />
=======

    <div className="min-h-screen flex items-center justify-center bg-[#0B1020] px-6">
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* CARD */}
        <div className="bg-dark-3 border border-dark-border rounded-2xl p-8">

          {/* LOGO */}
          <div className="mb-8">
            <VeriChainLogo size={34} />
          </div>

          <h2 className="text-xl font-medium text-[#e8e0cc] mb-1">Sign in</h2>
          <p className="text-[#555] text-sm mb-6">Decentralized identity verification</p>

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
=======
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
      >

        {/* LOGO */}

        <h1 className="text-4xl font-bold mb-2 text-white">

          Veri<span className="text-cyan-400">Chain</span>

        </h1>

        <p className="text-gray-400 mb-8">

          Blockchain Identity Verification Platform

        </p>

        {/* FORM */}

        <div className="space-y-4">

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
          />
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

          {/* BUTTON */}

          <button
            onClick={handleLogin}
            disabled={loading}
<<<<<<< HEAD
            className="btn-gold w-full justify-center mt-5 py-3 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#555] mt-5">
            No account?{" "}
            <Link to="/register" className="text-gold hover:opacity-80 transition">
              Register
            </Link>
          </p>

        </div>

        {/* bottom note */}
        <p className="text-center text-[#333] text-xs mt-4">
          Secured by Ethereum · SHA-256 Hashing
=======
            className="w-full bg-cyan-400 hover:bg-cyan-300 transition p-4 rounded-2xl font-semibold text-black"
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

        </div>

        {/* REGISTER */}

        <p className="mt-6 text-gray-400 text-center">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-cyan-400"
          >
            Register
          </Link>

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
        </p>

      </motion.div>

    </div>
  );
}