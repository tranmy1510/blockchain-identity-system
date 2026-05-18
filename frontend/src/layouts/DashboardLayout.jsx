import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B1020] text-white lg:flex">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex-shrink-0
        `}
      >
        <Sidebar />
      </aside>

      <div className="min-h-screen flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0B1020]/95 px-6 py-4 backdrop-blur-xl">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span className="text-white font-semibold">VeriChain</span>
            <span>/</span>
            <span className="capitalize">{user?.role || "Guest"}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 rounded-full border bg-gold/20 bg-gold/10 px-3 py-1.5 text-xs text-cyan-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              Local Blockchain
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-cyan-300">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="w-10 lg:hidden" />
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}