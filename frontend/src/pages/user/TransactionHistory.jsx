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
        error.response?.data?.message ||
          "Failed to load transaction history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}

      <div className="mb-10">
        <p className="text-gold font-medium">Blockchain Logs</p>

        <h1 className="text-5xl font-bold mt-2">
          Transaction History
        </h1>

        <p className="text-gray-400 mt-3">
          View blockchain verification activities and identity actions
        </p>
      </div>

      {/* HISTORY */}

      <div className="space-y-5">
        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">
            Loading transaction history...
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">
            No transaction history found
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                {/* LEFT */}

                <div className="flex-1">
                  <p className="text-gray-400">Action</p>

                  <h2 className="text-2xl font-bold mt-2">
                    {item.action}
                  </h2>

                  <p className="text-gray-300 mt-4">
                    {item.description}
                  </p>

                  <p className="text-gray-500 mt-4 text-sm">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}

                <div className="lg:w-[420px]">
                  <p className="text-gray-400 mb-2">
                    Blockchain Transaction Hash
                  </p>

                  <div className="bg-black/20 border border-white/10 rounded-2xl p-4 break-all text-sm text-gray-200">
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