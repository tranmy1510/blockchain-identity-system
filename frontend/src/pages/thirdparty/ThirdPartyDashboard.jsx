import { useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, ShieldX, Clock, Search } from "lucide-react";
import api from "../../services/api";

export default function ThirdPartyDashboard() {

  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.get(`/thirdparty/check/${userId.trim()}`);
      setResult(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else {
        toast.error(error.response?.data?.message || "Check failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    if (status === "verified") return {
      icon: <ShieldCheck size={40} className="text-green-400" />,
      label: "VERIFIED",
      color: "text-green-400",
      bg: "bg-green-500/10 border border-green-500/20",
      desc: "Blockchain identity verified successfully",
    };
    if (status === "pending") return {
      icon: <Clock size={40} className="text-yellow-400" />,
      label: "PENDING",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border border-yellow-500/20",
      desc: "Identity verification is in progress",
    };
    if (status === "rejected") return {
      icon: <ShieldX size={40} className="text-red-400" />,
      label: "REJECTED",
      color: "text-red-400",
      bg: "bg-red-500/10 border border-red-500/20",
      desc: "Identity verification was rejected",
    };
    return {
      icon: <ShieldX size={40} className="text-gray-400" />,
      label: "NOT VERIFIED",
      color: "text-gray-400",
      bg: "bg-white/5 border border-white/10",
      desc: "No verified identity found for this user",
    };
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-2">Verify Identity</h1>
      <p className="text-gray-400 mb-8">
        Check if a user has a verified blockchain identity
      </p>

      <div className="glass rounded-3xl p-8">

        {/* INPUT */}
        <label className="block text-gray-400 mb-2">User ID</label>
        <div className="flex gap-3">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Enter User ID"
            className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-primary hover:opacity-90 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            <Search size={18} />
            {loading ? "Checking..." : "Check"}
          </button>
        </div>

        {/* RESULT */}
        {result !== null && (() => {
          const display = getStatusDisplay(result.verificationStatus);
          return (
            <div className={`mt-8 p-6 rounded-2xl ${display.bg}`}>

              <div className="flex items-center gap-4 mb-4">
                {display.icon}
                <h3 className={`text-2xl font-bold ${display.color}`}>
                  {display.label}
                </h3>
              </div>

              <p className="text-gray-300 mb-4">{display.desc}</p>

              {/* Thông tin được chia sẻ */}
              {result.verificationStatus === "verified" && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Full Name</span>
                    <span>{result.fullName || "—"}</span>
                  </div>
                  {result.txHash && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tx Hash</span>
                      <span className="text-secondary text-sm break-all">
                        {result.txHash.slice(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })()}

      </div>

    </div>
  );
}