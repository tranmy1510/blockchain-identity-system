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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="text-gold font-medium">Blockchain Records</p>

        <h1 className="text-5xl font-bold mt-2">Blockchain Explorer</h1>

        <p className="text-gray-400 mt-3">
          Track identity hash, verification status, and blockchain transaction
          proof.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Verification Status</p>

              <h2
                className={`text-2xl font-bold mt-3 ${
                  statusData?.status === "Verified"
                    ? "text-green-400"
                    : statusData?.status === "Pending"
                    ? "text-yellow-400"
                    : statusData?.status === "Rejected"
                    ? "text-red-400"
                    : "text-gray-300"
                }`}
              >
                {statusData?.status || "Not Submitted"}
              </h2>
            </div>

            <ShieldCheck className="text-gold" size={42} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Identity Hash</p>

              <h2 className="text-xl font-bold mt-3">
                {statusData?.identityHash ? "Generated" : "Not Generated"}
              </h2>
            </div>

            <Hash className="text-purple-300" size={42} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Blockchain TX</p>

              <h2 className="text-xl font-bold mt-3">
                {statusData?.blockchainTxHash ? "Confirmed" : "No TX"}
              </h2>
            </div>

            {statusData?.blockchainTxHash ? (
              <CheckCircle className="text-green-400" size={42} />
            ) : (
              <Clock3 className="text-yellow-400" size={42} />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Current Identity Proof</h2>

        <div className="space-y-5">
          <div>
            <p className="text-gray-400 mb-2">Identity Hash</p>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4 break-all text-sm text-gray-200">
              {statusData?.identityHash || "No identity hash generated yet"}
            </div>
          </div>

          <div>
            <p className="text-gray-400 mb-2">Transaction Hash</p>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4 break-all text-sm text-gray-200">
              {statusData?.blockchainTxHash ||
                "No blockchain transaction available yet"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Search className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction hash, action, or description..."
            className="w-full bg-transparent p-3 outline-none text-white"
          />
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">
            Loading blockchain records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">
            No blockchain records found
          </div>
        ) : (
          filteredLogs.map((tx) => (
            <div
              key={tx._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/[0.07] transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-gray-400 text-sm">Action</p>
                    <h2 className="font-semibold">{tx.action}</h2>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Description</p>
                    <p className="text-gray-300">{tx.description}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Transaction Hash</p>
                    <p className="break-all text-sm">
                      {tx.txHash || "No blockchain transaction"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
                      tx.txHash
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {tx.txHash ? <CheckCircle size={18} /> : <Clock3 size={18} />}
                    {tx.txHash ? "Confirmed" : "Off-chain Log"}
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-gray-400 text-sm">Time</p>
                    <p>{new Date(tx.createdAt).toLocaleString()}</p>
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