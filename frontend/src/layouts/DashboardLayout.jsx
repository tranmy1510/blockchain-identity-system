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
          fixed inset-y-0 left-0 z-50 w-72
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex-shrink-0
        `}
      >
        <Sidebar />
      </aside>

      <div className="min-h-screen flex-1 bg-[#080808]">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#2b2207] bg-[#080808]/95 px-6 py-4 backdrop-blur-xl">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-[#2b2207] bg-[#111111] p-2 text-[#d4a017] lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm text-[#8f8568]">
            <span className="text-[#f5e6b8] font-semibold">VeriChain</span>
            <span className="text-[#5c543f]">/</span>
            <span className="capitalize text-[#d4a017]">
              {user?.role || "Guest"}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 rounded-full border border-[#d4a017]/50 bg-[#1a1405] px-3 py-1.5 text-xs font-medium text-[#f6c744]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              Local Blockchain
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2b2207] bg-[#111111] text-sm font-semibold text-[#f6c744]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="w-10 lg:hidden" />
        </div>

        <main className="min-h-[calc(100vh-73px)] bg-[#080808] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}