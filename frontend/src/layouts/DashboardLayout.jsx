import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import { Menu } from "lucide-react";

import { useState } from "react";

import { motion } from "framer-motion";

export default function DashboardLayout() {

  const [open, setOpen] = useState(false);

  return (

    <div className="flex min-h-screen bg-dark text-white">

      {/* MOBILE SIDEBAR */}

      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
          lg:translate-x-0
        `}
      >

        <Sidebar />

      </div>

      {/* MAIN */}

      <div className="flex-1 lg:ml-72">

        {/* TOPBAR */}

        <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-xl">

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >

            <Menu />

          </button>

          <h2 className="text-xl font-semibold">
            Blockchain Identity System
          </h2>

        </div>

        {/* CONTENT */}

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >

          <Outlet />

        </motion.main>

      </div>

    </div>
  );
}