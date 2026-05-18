import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function VerifierDashboard() {

  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id đang xử lý

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/verifier/pending");
      setPendingList(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load pending list");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/verifier/approve/${id}`);
      toast.success("Identity approved & recorded on blockchain!");
      // Xoá khỏi danh sách sau khi approve
      setPendingList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/verifier/reject/${id}`);
      toast.success("Identity rejected.");
      setPendingList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-2">Pending Verifications</h1>
      <p className="text-gray-400 mb-8">
        Review and approve identity requests
      </p>

      <div className="glass rounded-3xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : pendingList.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No pending verifications.
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4">Full Name</th>
                <th className="text-left p-4">Document ID</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingList.map((item) => (
                <tr key={item._id} className="border-t border-white/10">

                  <td className="p-4">{item.fullName}</td>

                  <td className="p-4">{item.documentId}</td>

                  <td className="p-4">{item.email}</td>

                  <td className="p-4 text-yellow-400 font-medium capitalize">
                    {item.verificationStatus}
                  </td>

                  <td className="p-4">
                    {actionLoading === item._id ? (
                      <span className="text-gray-400 text-sm">Processing...</span>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}