import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileClock,
  LogOut,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import VeriChainLogo from "./VeriChainLogo";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { walletAddress, connectWallet } = useWallet();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItem = (to, icon, label) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition border ${
          active
            ? "bg-[#1a1405] border-[#d4a017]/60 text-[#f6c744] font-semibold shadow-[0_0_18px_rgba(212,160,23,0.12)]"
            : "border-transparent text-[#7a745f] hover:text-[#f5e6b8] hover:bg-[#14110a] hover:border-[#2b2207]"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-[#050505] border-r border-[#2b2207] flex flex-col px-4 py-5 gap-2">
      <div className="px-2 mb-4">
        <VeriChainLogo />
      </div>

      <div className="section-label px-2 mb-1">Menu</div>

      <nav className="flex flex-col gap-1 flex-1">
        {user?.role &&
          navItem(
            `/${user.role}/dashboard`,
            <LayoutDashboard size={16} />,
            "Dashboard"
          )}

        {user?.role === "admin" &&
          navItem(
            "/admin/dashboard",
            <LayoutDashboard size={16} />,
            "Admin Panel"
          )}

        {user?.role === "user" && (
          <>
            {navItem(
              "/user/create-identity",
              <ShieldCheck size={16} />,
              "Create Identity"
            )}

            {navItem(
              "/user/share-access",
              <Users size={16} />,
              "Share Access"
            )}

            {navItem(
              "/explorer",
              <Search size={16} />,
              "Blockchain Explorer"
            )}

            {navItem(
              "/user/history",
              <FileClock size={16} />,
              "History"
            )}
          </>
        )}
      </nav>

      <div className="rounded-2xl border border-[#2b2207] bg-[#0d0d0d] p-3 mx-1 mb-2">
        <div className="section-label mb-1.5">Wallet</div>

        {walletAddress ? (
          <div className="font-mono text-xs text-[#f6c744]">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="text-xs font-semibold text-[#d4a017] hover:text-[#f6c744] transition"
          >
            + Connect Wallet
          </button>
        )}

        <div className="text-[11px] text-[#6f674f] mt-1">Local Blockchain</div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#b94a4a] hover:bg-[#1a0a0a] hover:text-[#ff6b6b] transition"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}