import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Database,
  Wallet,
  Activity,
} from "lucide-react";

import { useWallet } from "../../context/WalletContext";
import { useAuth } from "../../context/AuthContext";
import AnalyticsChart from "../../components/AnalyticsChart";
import api from "../../services/api";

export default function UserDashboard() {

  const { walletAddress, connectWallet } = useWallet();
  const { user } = useAuth();

  const [identity, setIdentity] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Lấy thông tin identity của user
      const identityRes = await api.get("/identity/me");
      setIdentity(identityRes.data.data);

      // Lấy lịch sử gần đây
      const historyRes = await api.get("/history");
      setHistory(historyRes.data.data?.slice(0, 3) || []);
    } catch (error) {
      // Chưa có identity thì để null
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "verified") return "text-green-400";
    if (status === "pending") return "text-yellow-400";
    if (status === "rejected") return "text-red-400";
    return "text-gray-400";
  };

  const getStatusLabel = (status) => {
    if (status === "verified") return "VERIFIED";
    if (status === "pending") return "PENDING";
    if (status === "rejected") return "REJECTED";
    return "NOT SUBMITTED";
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">User Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {user?.name || "User"}
          </p>
        </div>

        {/* CONNECT WALLET */}
        <button
          onClick={connectWallet}
          className="bg-gold text-[#111] px-6 py-3 rounded-xl font-semibold"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {/* VERIFICATION STATUS - lấy từ API thật */}
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Verification Status</p>
              {loading ? (
                <p className="text-gray-500 mt-3">Loading...</p>
              ) : (
                <h2 className={`text-2xl font-bold mt-3 ${getStatusColor(identity?.verificationStatus)}`}>
                  {getStatusLabel(identity?.verificationStatus)}
                </h2>
              )}
            </div>
            <ShieldCheck size={40} />
          </div>
        </div>

        {/* TX HASH - hiển thị nếu đã verified */}
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Blockchain Records</p>
              {identity?.txHash ? (
                <h2
                  className="text-sm font-bold mt-3 break-all text-secondary cursor-pointer"
                  title={identity.txHash}
                >
                  {identity.txHash.slice(0, 10)}...
                </h2>
              ) : (
                <h2 className="text-gray-500 text-sm mt-3">No record yet</h2>
              )}
            </div>
            <Database size={40} />
          </div>
        </div>

        {/* WALLET */}
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Wallet Address</p>
              <h2 className="text-lg font-bold mt-3 break-all">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not Connected"}
              </h2>
            </div>
            <Wallet size={40} />
          </div>
        </div>

        {/* IDENTITY COMPLETENESS */}
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Profile Complete</p>
              <h2 className="text-3xl font-bold mt-3">
                {identity ? "100%" : "0%"}
              </h2>
            </div>
            <Activity size={40} />
          </div>
        </div>

      </div>

      {/* NETWORK + SECURITY */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* IDENTITY INFO */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Identity Info</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : identity ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Full Name</span>
                <span>{identity.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date of Birth</span>
                <span>{identity.dob ? new Date(identity.dob).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Document ID</span>
                <span>{identity.documentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={getStatusColor(identity.verificationStatus)}>
                  {getStatusLabel(identity.verificationStatus)}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-4">
                You haven't created your identity yet.
              </p>
              <a
                href="/user/create-identity"
                className="bg-gold text-[#111] px-5 py-2 rounded-xl font-semibold inline-block"
              >
                Create Identity
              </a>
            </div>
          )}
        </div>

        {/* BLOCKCHAIN STATUS */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Blockchain Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Network</span>
              <span>Ethereum Sepolia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Smart Contract</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tx Hash</span>
              <span className="text-secondary break-all text-sm">
                {identity?.txHash
                  ? `${identity.txHash.slice(0, 12)}...`
                  : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wallet</span>
              <span>
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not connected"}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <AnalyticsChart />
      </div>

      {/* RECENT ACTIVITY - từ API */}
      <div className="glass rounded-3xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-white/10 pb-4"
              >
                <p>{item.action}</p>
                <span className="text-gray-400 text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recent activity.</p>
        )}
      </div>

    </div>
  );
}