import { useEffect, useState } from "react";
import { CheckCircle, Clock3, Search, Hash, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function BlockchainExplorer() {
  const [statusData, setStatusData] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);

      const [statusRes, historyRes] = await Promise.all([
        api.get("/identity/status").catch(() => ({ data: { data: null } })),
        api.get("/history/me").catch(() => ({ data: { data: [] } })),
      ]);

      setStatusData(statusRes.data.data);
      setHistory(historyRes.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load blockchain explorer"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const blockchainLogs = history.filter(
    (item) =>
      item.txHash ||
      item.action?.toLowerCase().includes("approve") ||
      item.description?.toLowerCase().includes("blockchain")
  );

  const filteredLogs = blockchainLogs.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.txHash?.toLowerCase().includes(keyword) ||
      item.action?.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <p className="text-sm text-gold font-medium">Blockchain Records</p>

        <h1 className="text-3xl font-bold mt-1">Blockchain Explorer</h1>

        <p className="text-sm text-gray-400 mt-1">
          Track identity hash, verification status, and blockchain transaction
          proof.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <StatCard
          label="Verification Status"
          value={statusData?.status || "Not Submitted"}
          icon={<ShieldCheck className="text-gold" size={30} />}
          valueClass={
            statusData?.status === "Verified"
              ? "text-green-400"
              : statusData?.status === "Pending"
              ? "text-yellow-400"
              : statusData?.status === "Rejected"
              ? "text-red-400"
              : "text-gray-300"
          }
        />

        <StatCard
          label="Identity Hash"
          value={statusData?.identityHash ? "Generated" : "Not Generated"}
          icon={<Hash className="text-purple-300" size={30} />}
        />

        <StatCard
          label="Blockchain TX"
          value={statusData?.blockchainTxHash ? "Confirmed" : "No TX"}
          icon={
            statusData?.blockchainTxHash ? (
              <CheckCircle className="text-green-400" size={30} />
            ) : (
              <Clock3 className="text-yellow-400" size={30} />
            )
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ProofBox
          title="Identity Hash"
          value={statusData?.identityHash || "No identity hash generated yet"}
        />

        <ProofBox
          title="Transaction Hash"
          value={
            statusData?.blockchainTxHash ||
            "No blockchain transaction available yet"
          }
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={18} />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction hash, action, or description..."
            className="w-full bg-transparent p-2 outline-none text-sm text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <EmptyState text="Loading blockchain records..." />
        ) : filteredLogs.length === 0 ? (
          <EmptyState text="No blockchain records found" />
        ) : (
          filteredLogs.slice(0, 5).map((tx) => (
            <div
              key={tx._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg hover:bg-white/[0.07] transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <p className="text-gray-400 text-xs">Action</p>
                    <h2 className="text-sm font-semibold">{tx.action}</h2>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Description</p>
                    <p className="text-sm text-gray-300">{tx.description}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Transaction Hash</p>
                    <p className="break-all text-xs text-gray-200 line-clamp-2">
                      {tx.txHash || "No blockchain transaction"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${
                      tx.txHash
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {tx.txHash ? (
                      <CheckCircle size={15} />
                    ) : (
                      <Clock3 size={15} />
                    )}
                    {tx.txHash ? "Confirmed" : "Off-chain Log"}
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-gray-400 text-xs">Time</p>
                    <p className="text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, valueClass = "text-white" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{label}</p>

          <h2 className={`text-xl font-bold mt-2 ${valueClass}`}>{value}</h2>
        </div>

        {icon}
      </div>
    </div>
  );
}

function ProofBox({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
      <h2 className="text-lg font-bold mb-2">{title}</h2>

      <div className="bg-black/20 border border-white/10 rounded-xl p-3 break-all text-xs text-gray-200 line-clamp-3">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}