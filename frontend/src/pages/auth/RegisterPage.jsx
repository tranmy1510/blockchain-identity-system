import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";
import VeriChainLogo from "../../components/VeriChainLogo";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("user");
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("Account created! Please sign in.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">

      <div className="fixed inset-0 pointer-events-none"
           style={{ backgroundImage: "radial-gradient(#1c1700 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-dark-3 border border-dark-border rounded-2xl p-8">

          <div className="mb-8">
            <VeriChainLogo size={34} />
          </div>

          <h2 className="text-xl font-medium text-[#e8e0cc] mb-1">Create account</h2>
          <p className="text-[#555] text-sm mb-6">Join the decentralized identity network</p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
              style={{ background: "#0d0d0d" }}
            >
              <option value="user">User / Citizen</option>
              <option value="verifier">Verifier Organization</option>
              <option value="thirdparty">Third Party</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="btn-gold w-full justify-center mt-5 py-3 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#555] mt-5">
            Already have an account?{" "}
            <Link to="/" className="text-gold hover:opacity-80 transition">
              Sign In
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