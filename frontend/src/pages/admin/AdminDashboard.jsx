import { Users, ShieldCheck, Activity, Database } from "lucide-react";

const users = [
  { name: "Nguyen Van A", status: "Verified" },
  { name: "Tran Thi B",   status: "Pending"  },
  { name: "Le Van C",     status: "Verified" },
];

const stats = [
  { label: "Total Users",         value: "1,248", icon: <Users size={20} />,      color: "" },
  { label: "Verified Identities", value: "986",   icon: <ShieldCheck size={20} />, color: "text-green-id" },
  { label: "Transactions",        value: "18K",   icon: <Database size={20} />,    color: "text-gold" },
  { label: "Network Health",      value: "99%",   icon: <Activity size={20} />,    color: "text-green-id" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Admin Dashboard</h1>
      <p className="text-[#555] text-sm mb-6">Blockchain Identity Management</p>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">{s.label}</p>
              <span className="text-[#444]">{s.icon}</span>
            </div>
            <p className={`text-2xl font-medium ${s.color || "text-[#e8e0cc]"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* USER TABLE */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
          <h2 className="text-sm font-medium text-[#e8e0cc]">User Verification</h2>
          <button className="btn-gold text-xs py-1.5 px-4">Export Logs</button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-dark-2">
              <th className="text-left px-5 py-3 section-label">Name</th>
              <th className="text-left px-5 py-3 section-label">Type</th>
              <th className="text-left px-5 py-3 section-label">Status</th>
              <th className="text-left px-5 py-3 section-label">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t border-dark-border hover:bg-dark-2/50 transition">
                <td className="px-5 py-3 text-sm">{u.name}</td>
                <td className="px-5 py-3 text-sm text-[#555]">Blockchain Identity</td>
                <td className="px-5 py-3">
                  <span className={u.status === "Verified" ? "badge-verified" : "badge-pending"}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button className="btn-ghost text-xs py-1.5 px-3">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}