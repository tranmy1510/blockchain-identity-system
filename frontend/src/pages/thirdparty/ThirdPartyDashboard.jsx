import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ThirdPartyDashboard() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!userId.trim()) {
      toast.error("Please enter User ID");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.get(`/thirdparty/check/${userId.trim()}`);

      setResult(response.data.data);
      toast.success("Verification completed");
    } catch (error) {
      setResult(null);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-gold font-medium">Third-party Portal</p>

        <h1 className="text-5xl font-bold mt-2">Verify Identity</h1>

        <p className="text-gray-400 mt-3">
          Verify blockchain identity authenticity using User ID.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <label className="block text-gray-400 mb-2">User ID</label>

        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Enter User ID"
          className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="mt-5 bg-gold hover:bg-yellow-400 transition px-8 py-4 rounded-2xl text-black font-semibold disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Verification"}
        </button>

        {result && (
          <div
            className={`mt-8 p-8 rounded-3xl border ${
              result.isVerified
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <h3
              className={`text-3xl font-bold ${
                result.isVerified ? "text-green-400" : "text-red-400"
              }`}
            >
              {result.isVerified ? "VERIFIED" : "NOT VERIFIED"}
            </h3>

            <p className="text-gray-300 mt-3">
              {result.isVerified
                ? "Blockchain identity verified successfully"
                : "Identity verification failed"}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <InfoRow label="User ID" value={result.userId} />
              <InfoRow label="Status" value={result.status} />
              <InfoRow
                label="Access Permission"
                value={result.hasAccess ? "Granted" : "Denied"}
              />

              <InfoRow
                label="Identity Hash"
                value={result.identityHash || "Not available"}
                long
              />

              <InfoRow
                label="Blockchain TX"
                value={result.blockchainTxHash || "Not available"}
                long
              />
            </div>

            {result.hasAccess && result.sharedData && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="text-xl font-bold mb-4">Shared Data</h4>

                <div className="space-y-3 text-sm">
                  {Object.entries(result.sharedData).map(([key, value]) => (
                    <InfoRow key={key} label={key} value={String(value)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, long = false }) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
      <span className="text-gray-400">{label}</span>

      <span
        className={`text-white ${
          long ? "break-all text-right md:max-w-[420px]" : "text-right"
        }`}
      >
        {value || "-"}
      </span>
    </div>
  );
}