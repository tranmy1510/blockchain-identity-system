import { useEffect, useState } from "react";
<<<<<<< HEAD
import { CheckCircle, Clock3, XCircle } from "lucide-react";
=======

import toast from "react-hot-toast";

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
import api from "../../services/api";

export default function TransactionHistory() {

  const [history, setHistory] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (action) => {
    if (action?.toLowerCase().includes("approved") || action?.toLowerCase().includes("verified")) {
      return <CheckCircle size={20} className="text-green-400" />;
    }
    if (action?.toLowerCase().includes("rejected")) {
      return <XCircle size={20} className="text-red-400" />;
    }
    return <Clock3 size={20} className="text-yellow-400" />;
  };

=======

  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {

    try {

      const response = await api.get(
        "/history/me"
      );

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

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
  return (

<<<<<<< HEAD
      <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
      <p className="text-gray-400 mb-8">
        All blockchain activity related to your identity
      </p>

      {loading ? (
        <div className="glass rounded-3xl p-10 text-center text-gray-400">
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-gray-400">
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="glass rounded-2xl p-6">
              <div className="flex justify-between items-start">

                <div className="flex items-start gap-4">
                  {getStatusIcon(item.action)}
                  <div>
                    <p className="font-semibold">{item.action}</p>
                    {item.txHash && (
                      <p className="text-secondary text-sm mt-1 break-all">
                        Tx: {item.txHash}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <p className="text-gray-400 text-sm">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
=======
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-cyan-400 font-medium">
          Blockchain Logs
        </p>

        <h1 className="text-5xl font-bold mt-2">
          Transaction History
        </h1>

        <p className="text-gray-400 mt-3">
          View blockchain verification activities and identity actions
        </p>

      </div>

      {/* HISTORY */}

      <div className="space-y-5">

        {
          loading ? (

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

                    <p className="text-gray-400">
                      Action
                    </p>

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

                      {
                        item.txHash ||
                        "No blockchain transaction"
                      }

                    </div>

                  </div>

                </div>

              </div>

            ))
          )
        }

      </div>
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

    </div>
  );
}