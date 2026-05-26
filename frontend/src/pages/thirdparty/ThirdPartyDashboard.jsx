import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ThirdPartyDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [requestedFields, setRequestedFields] = useState([
    "fullName",
    "email",
    "status",
  ]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const fieldOptions = ["fullName", "email", "status", "dob", "address", "phone"];

  const toggleField = (field) => {
    if (requestedFields.includes(field)) {
      setRequestedFields(requestedFields.filter((item) => item !== field));
    } else {
      setRequestedFields([...requestedFields, field]);
    }
  };

  const handleRequestAccess = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter user email");
      return;
    }

    if (requestedFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    try {
      setRequestLoading(true);

      await api.post("/access/request", {
        userEmail: userEmail.trim().toLowerCase(),
        requestedFields,
      });

      toast.success("Access request sent to user");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request access failed");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter user email");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.get(
        `/access/check?userEmail=${encodeURIComponent(
          userEmail.trim().toLowerCase()
        )}`
      );

      setResult(response.data.data);
      toast.success("Verification checked");
    } catch (error) {
      setResult(null);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-gold font-medium">Third-party Portal</p>

        <h1 className="text-5xl font-bold mt-2">Verify Identity</h1>

        <p className="text-gray-400 mt-3">
          Request user consent and verify shared blockchain identity data using
          user email.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Request Access</h2>

        <label className="block text-gray-400 mb-2">User Email</label>

        <input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter user email"
          className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
        />

        <div className="mt-6">
          <p className="text-gray-400 mb-3">Requested Fields</p>

          <div className="flex flex-wrap gap-3">
            {fieldOptions.map((field) => (
              <button
                type="button"
                key={field}
                onClick={() => toggleField(field)}
                className={`px-4 py-2 rounded-xl border transition ${
                  requestedFields.includes(field)
                    ? "bg-gold text-black border-gold"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRequestAccess}
            disabled={requestLoading}
            className="bg-gold hover:brightness-110 transition text-black px-8 py-4 rounded-2xl font-semibold disabled:opacity-60"
          >
            {requestLoading ? "Sending Request..." : "Request Access"}
          </button>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 transition text-white px-8 py-4 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Checking..." : "Check Verification"}
          </button>
        </div>

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
              {result.hasAccess
                ? "User has granted access to selected fields."
                : "Access has not been granted by the user."}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <InfoRow label="User Email" value={result.userEmail} />
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