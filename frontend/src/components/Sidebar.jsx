import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShieldCheck, Users,
  FileClock, LogOut, Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import VeriChainLogo from "./VeriChainLogo";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { walletAddress, connectWallet } = useWallet();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const navItem = (to, icon, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
          ${active
            ? "bg-gold-bg border border-gold-dim text-gold font-medium"
            : "text-[#666] hover:text-[#aaa] hover:bg-white/5"
          }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div
      className="w-64 h-screen bg-dark-2 border-r border-dark-border
                 flex flex-col px-4 py-5 gap-2"
    >
      {/* LOGO */}
      <div className="px-2 mb-4">
        <VeriChainLogo />
      </div>

<<<<<<< HEAD
      {/* MENU */}
      <div className="section-label px-2 mb-1">Menu</div>
=======
    <div className="w-72 h-screen bg-[#0b1020] border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl">
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

      <nav className="flex flex-col gap-1 flex-1">
        {navItem(`/${user?.role}/dashboard`, <LayoutDashboard size={16} />, "Dashboard")}

        {user?.role === "admin" && <>
          {navItem("/admin/dashboard", <LayoutDashboard size={16} />, "Admin Panel")}
        </>}

        {user?.role === "user" && <>
          {navItem("/user/create-identity", <ShieldCheck size={16} />, "Create Identity")}
          {navItem("/user/share-access",    <Users size={16} />,       "Share Access")}
          {navItem("/explorer",             <Search size={16} />,      "Blockchain Explorer")}
          {navItem("/user/history",         <FileClock size={16} />,   "History")}
        </>}
      </nav>

      {/* WALLET */}
      <div className="card p-3 mx-1 mb-2">
        <div className="section-label mb-1.5">Wallet</div>
        {walletAddress ? (
          <div className="mono text-xs">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</div>
        ) : (
          <button
            onClick={connectWallet}
            className="text-xs text-gold hover:opacity-80 transition"
          >
            + Connect Wallet
          </button>
        )}
        <div className="text-[11px] text-[#444] mt-1">Sepolia Testnet</div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm
                   text-[#6b2020] hover:bg-[#1a0a0a] transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}