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
      <div className="flex min-h-[45vh] items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-gold">User Portal</p>

          <h1 className="text-3xl font-bold text-white">User Dashboard</h1>

          <p className="mt-1 text-sm text-gray-400">
            Manage your blockchain identity, verification status, and access
            history.
          </p>
        </div>

        <button
          onClick={connectWallet}
          className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>

      {!identity && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h2 className="text-base font-bold text-yellow-300">
                No identity profile yet
              </h2>

              <p className="mt-1 text-sm text-gray-300">
                Create your digital identity first, then submit it for verifier
                review.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Verification Status"
          value={status}
          icon={<ShieldCheck size={30} className={statusColor} />}
          valueClass={statusColor}
        />

        <StatCard
          label="Blockchain Record"
          value={statusData?.blockchainTxHash ? "Stored" : "Not Stored"}
          icon={<Database size={30} className="text-blue-300" />}
        />

        <StatCard
          label="Wallet Address"
          value={
            walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Not Connected"
          }
          icon={<Wallet size={30} className="text-purple-300" />}
        />

        <StatCard
          label="Activity Logs"
          value={history.length}
          icon={<Activity size={30} className="text-gold" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Identity Profile</h2>

          {identity ? (
            <div className="space-y-2">
              <InfoRow label="Full Name" value={identity.fullName} />
              <InfoRow label="Email" value={identity.email} />
              <InfoRow label="Date of Birth" value={formatDate(identity.dob)} />
              <InfoRow label="National ID" value={identity.documentId} />
              <InfoRow label="Address" value={identity.address} />
            </div>
          ) : (
            <p className="text-sm text-gray-400">No identity data available.</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Blockchain Proof</h2>

          <div className="space-y-3">
            <ProofBox
              label="Identity Hash"
              value={statusData?.identityHash || "Not generated yet"}
            />

            <ProofBox
              label="Transaction Hash"
              value={
                statusData?.blockchainTxHash || "No blockchain transaction yet"
              }
            />

            <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
              <Fingerprint size={20} className="text-green-400" />

              <p className="text-xs text-gray-300">
                Personal data stays off-chain. Blockchain stores only the hash
                and verification proof.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <FileClock size={20} className="text-gold" />

          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>

        {history.length > 0 ? (
          <div className="space-y-2">
            {history.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-1 border-b border-white/10 pb-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>

                <span className="text-xs text-gray-500">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No activity yet.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, valueClass = "text-white" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{label}</p>

          <h2 className={`mt-2 text-xl font-bold ${valueClass}`}>{value}</h2>
        </div>

        {icon}
      </div>
    </div>
  );
}

function ProofBox({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-400">{label}</p>

      <p className="line-clamp-2 break-all rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-gray-200">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/10 pb-2 md:flex-row md:items-center md:justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-white">{value || "-"}</span>
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