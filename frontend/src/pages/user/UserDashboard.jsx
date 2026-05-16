import {
  ShieldCheck,
  Database,
  Wallet,
  Activity,
} from "lucide-react";

import { useWallet } from "../../context/WalletContext";

import AnalyticsChart from "../../components/AnalyticsChart";

const activities = [
  {
    title: "Identity Verified",
    time: "2 mins ago",
  },
  {
    title: "Access Granted to Bank",
    time: "10 mins ago",
  },
  {
    title: "Blockchain Transaction Confirmed",
    time: "30 mins ago",
  },
];

export default function UserDashboard() {

  const {
    walletAddress,
    connectWallet,
  } = useWallet();

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            User Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Blockchain Identity Overview
          </p>

        </div>

        {/* CONNECT WALLET */}

        <button
          onClick={connectWallet}
          className="bg-secondary text-black px-6 py-3 rounded-xl font-semibold"
        >

          {
            walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"
          }

        </button>

      </div>

      {/* STATS */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {/* VERIFICATION */}

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Verification Status
              </p>

              <h2 className="text-3xl font-bold mt-3 text-green-400">
                VERIFIED
              </h2>

            </div>

            <ShieldCheck size={40} />

          </div>

        </div>

        {/* BLOCKCHAIN RECORDS */}

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Blockchain Records
              </p>

              <h2 className="text-3xl font-bold mt-3">
                24
              </h2>

            </div>

            <Database size={40} />

          </div>

        </div>

        {/* WALLET */}

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Wallet Address
              </p>

              <h2 className="text-lg font-bold mt-3 break-all">

                {
                  walletAddress
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                    : "Not Connected"
                }

              </h2>

            </div>

            <Wallet size={40} />

          </div>

        </div>

        {/* ACTIVITY */}

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Activity Score
              </p>

              <h2 className="text-3xl font-bold mt-3">
                91%
              </h2>

            </div>

            <Activity size={40} />

          </div>

        </div>

      </div>

      {/* NETWORK + SECURITY */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* NETWORK STATUS */}

        <div className="glass rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Blockchain Network
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">

              <span className="text-gray-400">
                Network
              </span>

              <span>
                Ethereum Sepolia
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Smart Contract
              </span>

              <span className="text-green-400">
                Active
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Gas Fee
              </span>

              <span>
                0.002 ETH
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Last Block
              </span>

              <span>
                #20495
              </span>

            </div>

          </div>

        </div>

        {/* SECURITY STATUS */}

        <div className="glass rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Security Status
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">

              <span className="text-gray-400">
                Encryption
              </span>

              <span className="text-green-400">
                AES-256
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Identity Risk
              </span>

              <span className="text-green-400">
                Low
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Access Logs
              </span>

              <span>
                18 Events
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Wallet Security
              </span>

              <span className="text-green-400">
                Protected
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-8">
  <AnalyticsChart />
</div>

      {/* RECENT ACTIVITY */}

      <div className="glass rounded-3xl p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {
            activities.map((item, index) => (

              <div
                key={index}
                className="flex justify-between items-center border-b border-white/10 pb-4"
              >

                <p>
                  {item.title}
                </p>

                <span className="text-gray-400">
                  {item.time}
                </span>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}