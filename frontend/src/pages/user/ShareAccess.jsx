import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import api from "../../services/api";

export default function ShareAccess() {

  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedList, setSharedList] = useState([]);

  useEffect(() => {
    fetchSharedList();
  }, []);

  const fetchSharedList = async () => {
    try {
      const res = await api.get("/access/list");
      setSharedList(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async () => {
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setLoading(true);
    try {
      await api.post("/access/grant", { organization: orgName.trim() });
      toast.success(`Access granted to ${orgName}`);
      setOrgName("");
      fetchSharedList(); // Refresh danh sách
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to grant access");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.post(`/access/revoke/${id}`);
      toast.success("Access revoked");
      setSharedList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke access");
    }
  };

  return (
    <div className="max-w-2xl">

      <h1 className="text-4xl font-bold mb-2">Share Access</h1>
      <p className="text-gray-400 mb-8">
        Grant or revoke third-party access to your verified identity
      </p>

      {/* GRANT FORM */}
      <div className="glass rounded-3xl p-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Grant New Access</h2>

        <label className="block text-gray-400 mb-2">Organization Name</label>
        <input
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. VietcomBank, Grab, ..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none mb-4"
        />

        <button
          onClick={handleShare}
          disabled={loading}
          className="bg-secondary text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
        >
          <Plus size={18} />
          {loading ? "Granting..." : "Grant Access"}
        </button>
      </div>

      {/* SHARED LIST */}
      <div className="glass rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-4">Organizations with Access</h2>

        {sharedList.length === 0 ? (
          <p className="text-gray-400">
            No organizations have access to your identity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {sharedList.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border border-white/10 rounded-2xl p-4"
              >
                <div>
                  <p className="font-semibold">{item.organization}</p>
                  <p className="text-gray-400 text-sm">
                    Granted {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(item._id)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/40 transition px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}