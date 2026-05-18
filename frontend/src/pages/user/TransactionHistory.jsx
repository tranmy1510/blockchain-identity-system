import { useEffect, useState } from "react";
import { CheckCircle, Clock3, XCircle } from "lucide-react";
import api from "../../services/api";

export default function TransactionHistory() {

  const [history, setHistory] = useState([]);
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

  return (
    <div>

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

    </div>
  );
}