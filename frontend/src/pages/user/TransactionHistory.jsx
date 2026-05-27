import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history/me");

      setHistory(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load transaction history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <p className="text-sm text-gold font-medium">Blockchain Logs</p>

        <h1 className="text-3xl font-bold mt-1">Transaction History</h1>

        <p className="text-sm text-gray-400 mt-1">
          View blockchain verification activities and identity actions.
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <EmptyState text="Loading transaction history..." />
        ) : history.length === 0 ? (
          <EmptyState text="No transaction history found" />
        ) : (
          history.slice(0, 6).map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Action</p>

                  <h2 className="text-lg font-bold mt-1">{item.action}</h2>

                  <p className="text-sm text-gray-300 mt-2">
                    {item.description}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="lg:w-[420px]">
                  <p className="text-xs text-gray-400 mb-1.5">
                    Blockchain Transaction Hash
                  </p>

                  <div className="bg-black/20 border border-white/10 rounded-xl p-3 break-all text-xs text-gray-200 line-clamp-3">
                    {item.txHash || "No blockchain transaction"}
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

function EmptyState({ text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}