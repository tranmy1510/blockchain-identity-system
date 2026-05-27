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
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <p className="text-sm text-gold font-medium">Third-party Portal</p>

        <h1 className="text-3xl font-bold mt-1">Verify Identity</h1>

        <p className="text-sm text-gray-400 mt-1">
          Request user consent and verify shared identity data using user email.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Request Access</h2>

        <label className="block text-sm text-gray-400 mb-1.5">User Email</label>

        <input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter user email"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white"
        />

        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Requested Fields</p>

          <div className="flex flex-wrap gap-2">
            {fieldOptions.map((field) => (
              <button
                type="button"
                key={field}
                onClick={() => toggleField(field)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition ${
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

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRequestAccess}
            disabled={requestLoading}
            className="bg-gold hover:brightness-110 transition text-black px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {requestLoading ? "Sending Request..." : "Request Access"}
          </button>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 transition text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Checking..." : "Check Verification"}
          </button>
        </div>

        {result && (
          <div
            className={`mt-5 p-5 rounded-2xl border ${
              result.isVerified
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className={`text-2xl font-bold ${
                    result.isVerified ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result.isVerified ? "VERIFIED" : "NOT VERIFIED"}
                </h3>

                <p className="text-sm text-gray-300 mt-1">
                  {result.hasAccess
                    ? "User has granted access to selected fields."
                    : "Access has not been granted by the user."}
                </p>
              </div>

              <span
                className={`w-fit px-3 py-1.5 rounded-lg text-xs ${
                  result.hasAccess
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {result.hasAccess ? "Access Granted" : "Access Denied"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <InfoRow label="User Email" value={result.userEmail} />
              <InfoRow label="Status" value={result.status} />
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
              <div className="mt-4 border-t border-white/10 pt-4">
                <h4 className="text-lg font-bold mb-3">Shared Data</h4>

                <div className="grid gap-2 md:grid-cols-2">
                  {Object.entries(result.sharedData).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-white/10 bg-black/20 p-3"
                    >
                      <p className="text-xs text-gray-400">{key}</p>
                      <p className="mt-1 text-sm font-semibold text-white break-words">
                        {String(value)}
                      </p>
                    </div>
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
    <div className="flex flex-col gap-1 border-b border-white/10 pb-2 md:flex-row md:items-start md:justify-between">
      <span className="text-gray-400">{label}</span>

      <span
        className={`text-white text-right ${
          long ? "break-all md:max-w-[520px] line-clamp-2" : ""
        }`}
      >
        {value || "-"}
      </span>
    </div>
  );
}