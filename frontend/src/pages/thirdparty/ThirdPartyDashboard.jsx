import { useState } from "react";
<<<<<<< HEAD
import toast from "react-hot-toast";
import { ShieldCheck, ShieldX, Clock, Search } from "lucide-react";
=======

import toast from "react-hot-toast";

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
import api from "../../services/api";

export default function ThirdPartyDashboard() {

  const [userId, setUserId] = useState("");
<<<<<<< HEAD
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.get(`/thirdparty/check/${userId.trim()}`);
      setResult(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else {
        toast.error(error.response?.data?.message || "Check failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    if (status === "verified") return {
      icon: <ShieldCheck size={40} className="text-green-400" />,
      label: "VERIFIED",
      color: "text-green-400",
      bg: "bg-green-500/10 border border-green-500/20",
      desc: "Blockchain identity verified successfully",
    };
    if (status === "pending") return {
      icon: <Clock size={40} className="text-yellow-400" />,
      label: "PENDING",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border border-yellow-500/20",
      desc: "Identity verification is in progress",
    };
    if (status === "rejected") return {
      icon: <ShieldX size={40} className="text-red-400" />,
      label: "REJECTED",
      color: "text-red-400",
      bg: "bg-red-500/10 border border-red-500/20",
      desc: "Identity verification was rejected",
    };
    return {
      icon: <ShieldX size={40} className="text-gray-400" />,
      label: "NOT VERIFIED",
      color: "text-gray-400",
      bg: "bg-white/5 border border-white/10",
      desc: "No verified identity found for this user",
    };
  };

=======

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {

    if (!userId) {

      toast.error("Please enter User ID");

      return;
    }

    try {

      setLoading(true);

      const response = await api.get(
        `/thirdparty/check/${userId}`
      );

      setResult(response.data.data);

      toast.success("Verification completed");

    } catch (error) {

      setResult(null);

      toast.error(
        error.response?.data?.message ||
        "Verification failed"
      );

    } finally {

      setLoading(false);

    }
  };

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
  return (

<<<<<<< HEAD
      <h1 className="text-4xl font-bold mb-2">Verify Identity</h1>
      <p className="text-gray-400 mb-8">
        Check if a user has a verified blockchain identity
      </p>
=======
    <div className="max-w-4xl mx-auto">
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-cyan-400 font-medium">
          Third-party Portal
        </p>

        <h1 className="text-5xl font-bold mt-2">
          Verify Identity
        </h1>

        <p className="text-gray-400 mt-3">
          Verify blockchain identity authenticity using User ID
        </p>

      </div>

      {/* SEARCH CARD */}

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

        {/* INPUT */}

<<<<<<< HEAD
        {/* INPUT */}
        <label className="block text-gray-400 mb-2">User ID</label>
        <div className="flex gap-3">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Enter User ID"
            className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-primary hover:opacity-90 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            <Search size={18} />
            {loading ? "Checking..." : "Check"}
          </button>
        </div>
=======
        <input
          value={userId}
          onChange={(e) =>
            setUserId(e.target.value)
          }
          placeholder="Enter User ID"
          className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
        />

        {/* BUTTON */}

        <button
          onClick={handleCheck}
          disabled={loading}
          className="mt-5 bg-cyan-400 hover:bg-cyan-300 transition px-8 py-4 rounded-2xl text-black font-semibold"
        >

          {
            loading
              ? "Checking..."
              : "Check Verification"
          }

        </button>

        {/* RESULT */}

        {
          result && (

            <div
              className={`mt-8 p-8 rounded-3xl border ${
                result.isVerified
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >

              {/* STATUS */}

              <h3
                className={`text-3xl font-bold ${
                  result.isVerified
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >

                {
                  result.isVerified
                    ? "VERIFIED"
                    : "NOT VERIFIED"
                }

              </h3>

              {/* MESSAGE */}

              <p className="text-gray-300 mt-3">

                {
                  result.isVerified
                    ? "Blockchain identity verified successfully"
                    : "Identity verification failed"
                }

              </p>

              {/* DETAILS */}

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between border-b border-white/10 pb-3">

                  <span className="text-gray-400">
                    User ID
                  </span>

                  <span>
                    {result.userId}
                  </span>

                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">

                  <span className="text-gray-400">
                    Status
                  </span>

                  <span>
                    {result.status}
                  </span>

                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">

                  <span className="text-gray-400">
                    Access Permission
                  </span>

                  <span>
                    {
                      result.hasAccess
                        ? "Granted"
                        : "Denied"
                    }
                  </span>

                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">

                  <span className="text-gray-400">
                    Identity Hash
                  </span>

                  <span className="break-all text-right max-w-[300px]">

                    {
                      result.identityHash ||
                      "Not available"
                    }

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Blockchain TX
                  </span>

                  <span className="break-all text-right max-w-[300px]">

                    {
                      result.blockchainTxHash ||
                      "Not available"
                    }

                  </span>

                </div>

              </div>

            </div>
          )
        }
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

        {/* RESULT */}
        {result !== null && (() => {
          const display = getStatusDisplay(result.verificationStatus);
          return (
            <div className={`mt-8 p-6 rounded-2xl ${display.bg}`}>

              <div className="flex items-center gap-4 mb-4">
                {display.icon}
                <h3 className={`text-2xl font-bold ${display.color}`}>
                  {display.label}
                </h3>
              </div>

              <p className="text-gray-300 mb-4">{display.desc}</p>

              {/* Thông tin được chia sẻ */}
              {result.verificationStatus === "verified" && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Full Name</span>
                    <span>{result.fullName || "—"}</span>
                  </div>
                  {result.txHash && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tx Hash</span>
                      <span className="text-secondary text-sm break-all">
                        {result.txHash.slice(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })()}

      </div>

    </div>
  );
}