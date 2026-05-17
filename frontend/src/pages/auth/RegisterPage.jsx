import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("Register successful! Please login.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-6">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="text-4xl font-bold mb-2">Create Account</h1>

        <p className="text-gray-400 mb-8">
          Register your blockchain identity account
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#141B34] border border-white/10 outline-none"
          >
            <option value="user">User</option>
            <option value="verifier">Verifier</option>
            <option value="thirdparty">Third Party</option>
          </select>

          <button
            onClick={handleRegister}
            className="w-full bg-secondary text-black p-4 rounded-xl font-semibold"
          >
            Register
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-secondary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}