import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileClock,
  LogOut,
  Search,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const { logout, user } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (

    <div className="w-72 h-screen glass border-r border-white/10 p-6 flex flex-col justify-between">

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold">
            Veri<span className="text-secondary">Chain</span>
          </h1>

          <p className="text-gray-400 text-sm mt-2 capitalize">
            {user?.role || "Guest"}
          </p>

        </div>

        {/* MENU */}

        <div className="space-y-3">

          {/* DASHBOARD */}

          <Link
            to={`/${user?.role}/dashboard`}
            className={`
              w-full flex items-center gap-3 p-4 rounded-xl transition
              ${
                location.pathname === `/${user?.role}/dashboard`
                  ? "bg-secondary text-black font-semibold"
                  : "hover:bg-white/10"
              }
            `}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>

          {/* ADMIN MENU */}

          {
            user?.role === "admin" && (

              <Link
                to="/admin/dashboard"
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl transition
                  ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-secondary text-black font-semibold"
                      : "hover:bg-white/10"
                  }
                `}
              >
                <LayoutDashboard />
                <span>Admin Dashboard</span>
              </Link>

            )
          }

          {/* USER MENUS */}

          {
            user?.role === "user" && (
              <>

                {/* CREATE IDENTITY */}

                <Link
                  to="/user/create-identity"
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl transition
                    ${
                      location.pathname === "/user/create-identity"
                        ? "bg-secondary text-black font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <ShieldCheck />
                  <span>Create Identity</span>
                </Link>

                {/* SHARE ACCESS */}

                <Link
                  to="/user/share-access"
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl transition
                    ${
                      location.pathname === "/user/share-access"
                        ? "bg-secondary text-black font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <Users />
                  <span>Share Access</span>
                </Link>

                {/* BLOCKCHAIN EXPLORER */}

                <Link
                  to="/explorer"
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl transition
                    ${
                      location.pathname === "/explorer"
                        ? "bg-secondary text-black font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <Search />
                  <span>Blockchain Explorer</span>
                </Link>

                {/* TRANSACTION HISTORY */}

                <Link
                  to="/user/history"
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl transition
                    ${
                      location.pathname === "/user/history"
                        ? "bg-secondary text-black font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <FileClock />
                  <span>Transaction History</span>
                </Link>

              </>
            )
          }

        </div>

      </div>

      {/* LOGOUT */}

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
      >

        <LogOut />

        <span>Logout</span>

      </button>

    </div>
  );
}