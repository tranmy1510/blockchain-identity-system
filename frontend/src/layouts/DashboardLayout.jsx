import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5e6b8] lg:flex">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex-shrink-0
        `}
      >
        <Sidebar />
      </aside>

      <div className="min-h-screen flex-1 bg-[#080808]">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#2b2207] bg-[#080808]/95 px-5 backdrop-blur-xl">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-[#2b2207] bg-[#111111] p-2 text-[#d4a017] lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#8f8568]">
            <span className="text-[#f5e6b8] font-semibold">VeriChain</span>
            <span className="text-[#5c543f]">/</span>
            <span className="capitalize text-[#d4a017]">
              {user?.role || "Guest"}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 rounded-full border border-[#d4a017]/50 bg-[#1a1405] px-3 py-1 text-[11px] font-medium text-[#f6c744]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              Local Blockchain
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2b2207] bg-[#111111] text-xs font-semibold text-[#f6c744]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="w-9 lg:hidden" />
        </div>

        <main className="min-h-[calc(100vh-56px)] bg-[#080808] px-5 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}