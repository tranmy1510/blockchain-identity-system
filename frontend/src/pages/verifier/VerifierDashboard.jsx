import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import api from "../../services/api";

export default function VerifierDashboard() {
  const navigate = useNavigate();

  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchPendingIdentities();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <p className="text-sm text-gold font-medium">Verifier Portal</p>

        <h1 className="text-3xl font-bold mt-1">Pending Verifications</h1>

        <p className="text-sm text-gray-400 mt-1">
          Review identity details before approving or rejecting submissions.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="text-left p-3">Full Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">National ID</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-400">
                    Loading pending identities...
                  </td>
                </tr>
              ) : identities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-400">
                    No pending identities
                  </td>
                </tr>
              ) : (
                identities.map((identity) => (
                  <tr
                    key={identity._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-3 font-medium">{identity.fullName}</td>

                    <td className="p-3 text-gray-300">{identity.email}</td>

                    <td className="p-3">{identity.documentId}</td>

                    <td className="p-3">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg text-xs">
                        {identity.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(`/verifier/identity/${identity._id}`)
                        }
                        className="bg-gold text-black hover:opacity-90 transition px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}