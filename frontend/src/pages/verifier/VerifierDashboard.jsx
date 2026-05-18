import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function VerifierDashboard() {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingIdentities = async () => {
    try {
      setLoading(true);

      const response = await api.get("/verifier/pending");

      setIdentities(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load pending identities"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      await api.put(`/verifier/approve/${id}`);

      toast.success("Identity approved successfully");

      fetchPendingIdentities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      await api.put(`/verifier/reject/${id}`);

      toast.success("Identity rejected successfully");

      fetchPendingIdentities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPendingIdentities();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <p className="text-cyan-400 font-medium">Verifier Portal</p>

        <h1 className="text-5xl font-bold mt-2">Pending Verifications</h1>

        <p className="text-gray-400 mt-3">
          Review and verify submitted blockchain identities
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="text-left p-5">Full Name</th>
              <th className="text-left p-5">Email</th>
              <th className="text-left p-5">National ID</th>
              <th className="text-left p-5">Status</th>
              <th className="text-left p-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading pending identities...
                </td>
              </tr>
            ) : identities.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No pending identities
                </td>
              </tr>
            ) : (
              identities.map((identity) => (
                <tr
                  key={identity._id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-5 font-medium">{identity.fullName}</td>

                  <td className="p-5 text-gray-300">{identity.email}</td>

                  <td className="p-5">{identity.documentId}</td>

                  <td className="p-5">
                    <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl text-sm">
                      {identity.status}
                    </span>
                  </td>

                  <td className="p-5">
                    {actionLoading === identity._id ? (
                      <span className="text-gray-400 text-sm">
                        Processing...
                      </span>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(identity._id)}
                          className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-xl font-medium"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(identity._id)}
                          className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}