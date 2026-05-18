import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Database,
  Wallet,
  Activity,
  FileClock,
  Fingerprint,
  AlertCircle,
} from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import API from "../../services/api";

export default function UserDashboard() {
  const { walletAddress, connectWallet } = useWallet();

  const [identity, setIdentity] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const requests = [
        API.get("/identity/status").catch(() => ({ data: { data: null } })),
        API.get("/identity/me").catch(() => ({ data: { data: null } })),
        API.get("/history/me").catch(() => ({ data: { data: [] } })),
      ];

      const [statusRes, identityRes, historyRes] = await Promise.all(requests);

      setStatusData(statusRes.data.data);
      setIdentity(identityRes.data.data);
      setHistory(historyRes.data.data || []);
    } catch (error) {
      console.error("Load dashboard failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const status = statusData?.status || identity?.status || "Not Submitted";

  const statusColor =
    status === "Verified"
      ? "text-green-400"
      : status === "Pending"
      ? "text-yellow-400"
      : status === "Rejected"
      ? "text-red-400"
      : "text-gray-300";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-gray-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 font-semibold text-gold">User Portal</p>

          <h1 className="text-4xl font-bold text-white">User Dashboard</h1>

          <p className="mt-2 text-gray-400">
            Manage your blockchain identity, verification status, and access
            history.
          </p>
        </div>

        <button
          onClick={connectWallet}
          className="rounded-2xl bg-gold px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>

      {!identity && (
        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-4">
            <AlertCircle className="mt-1 text-yellow-400" />

            <div>
              <h2 className="text-xl font-bold text-yellow-300">
                No identity profile yet
              </h2>

              <p className="mt-2 text-gray-300">
                Create your digital identity first, then submit it for verifier
                review.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Verification Status</p>

              <h2 className={`mt-3 text-2xl font-bold ${statusColor}`}>
                {status}
              </h2>
            </div>

            <ShieldCheck size={42} className={statusColor} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Blockchain Record</p>

              <h2 className="mt-3 text-xl font-bold">
                {statusData?.blockchainTxHash ? "Stored" : "Not Stored"}
              </h2>
            </div>

            <Database size={42} className="text-blue-300" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Wallet Address</p>

              <h2 className="mt-3 break-all text-lg font-bold">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not Connected"}
              </h2>
            </div>

            <Wallet size={42} className="text-purple-300" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Activity Logs</p>

              <h2 className="mt-3 text-3xl font-bold">
                {history.length}
              </h2>
            </div>

            <Activity size={42} className="text-gold" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold">Identity Profile</h2>

          {identity ? (
            <div className="space-y-4">
              <InfoRow label="Full Name" value={identity.fullName} />
              <InfoRow label="Email" value={identity.email} />
              <InfoRow label="Date of Birth" value={formatDate(identity.dob)} />
              <InfoRow label="National ID" value={identity.documentId} />
              <InfoRow label="Address" value={identity.address} />
            </div>
          ) : (
            <p className="text-gray-400">No identity data available.</p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold">Blockchain Proof</h2>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-gray-400">Identity Hash</p>

              <p className="break-all rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-200">
                {statusData?.identityHash || "Not generated yet"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-gray-400">Transaction Hash</p>

              <p className="break-all rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-200">
                {statusData?.blockchainTxHash || "No blockchain transaction yet"}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <Fingerprint className="text-green-400" />

              <p className="text-sm text-gray-300">
                Personal data stays off-chain. Blockchain stores only the hash
                and verification proof.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <FileClock className="text-gold" />

          <h2 className="text-2xl font-bold">Recent Activity</h2>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.slice(0, 6).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{item.action}</p>
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No activity yet.</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-white">{value || "-"}</span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

function formatDateTime(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString();
}