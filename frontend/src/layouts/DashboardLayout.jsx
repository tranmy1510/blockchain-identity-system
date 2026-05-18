import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-dark text-[#e8e0cc]">

      {/* SIDEBAR — mobile overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* BACKDROP mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* TOPBAR */}
        <div className="sticky top-0 z-30 flex items-center justify-between
                        px-6 py-3 bg-dark-2/80 backdrop-blur border-b border-dark-border">

          <button onClick={() => setOpen(!open)} className="lg:hidden text-[#666]">
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[#444] text-sm">
            <span className="text-[#333]">VeriChain</span>
            <span>/</span>
            <span className="text-[#e8e0cc] capitalize">{user?.role || "—"}</span>
          </div>

          {/* RIGHT: network badge + avatar */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 bg-gold-bg border border-gold-dim
                            text-gold text-xs px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              Sepolia Testnet
            </div>

            <div className="w-8 h-8 rounded-xl bg-gold-bg border border-gold-dim
                            flex items-center justify-center text-gold font-medium text-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

        </div>

        {/* PAGE CONTENT */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>

      </div>
    </div>
  );
}