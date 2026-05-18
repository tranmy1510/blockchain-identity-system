import { useEffect, useState } from "react";
<<<<<<< HEAD
import toast from "react-hot-toast";
=======

import toast from "react-hot-toast";

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
import api from "../../services/api";

export default function VerifierDashboard() {

<<<<<<< HEAD
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id đang xử lý

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/verifier/pending");
      setPendingList(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load pending list");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/verifier/approve/${id}`);
      toast.success("Identity approved & recorded on blockchain!");
      // Xoá khỏi danh sách sau khi approve
      setPendingList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/verifier/reject/${id}`);
      toast.success("Identity rejected.");
      setPendingList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

=======
  const [identities, setIdentities] = useState([]);

  const [loading, setLoading] = useState(true);

  // LOAD PENDING IDENTITIES
  const fetchPendingIdentities = async () => {

    try {

      const response = await api.get(
        "/verifier/pending"
      );

      setIdentities(response.data.data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load pending identities"
      );

    } finally {

      setLoading(false);

    }
  };

  // APPROVE
  const handleApprove = async (id) => {

    try {

      await api.put(
        `/verifier/approve/${id}`
      );

      toast.success(
        "Identity approved successfully"
      );

      fetchPendingIdentities();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Approve failed"
      );
    }
  };

  // REJECT
  const handleReject = async (id) => {

    try {

      await api.put(
        `/verifier/reject/${id}`
      );

      toast.success(
        "Identity rejected successfully"
      );

      fetchPendingIdentities();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Reject failed"
      );
    }
  };

  useEffect(() => {

    fetchPendingIdentities();

  }, []);

>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
  return (

    <div>

<<<<<<< HEAD
      <h1 className="text-4xl font-bold mb-2">Pending Verifications</h1>
      <p className="text-gray-400 mb-8">
        Review and approve identity requests
      </p>
=======
      {/* HEADER */}
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

      <div className="mb-8">

        <p className="text-cyan-400 font-medium">
          Verifier Portal
        </p>

        <h1 className="text-5xl font-bold mt-2">
          Pending Verifications
        </h1>

        <p className="text-gray-400 mt-3">
          Review and verify submitted blockchain identities
        </p>

      </div>

      {/* TABLE */}

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : pendingList.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No pending verifications.
          </div>
        ) : (
          <table className="w-full">

<<<<<<< HEAD
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4">Full Name</th>
                <th className="text-left p-4">Document ID</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingList.map((item) => (
                <tr key={item._id} className="border-t border-white/10">
=======
          <thead className="bg-white/5 text-gray-300">

            <tr>

              <th className="text-left p-5">
                Full Name
              </th>

              <th className="text-left p-5">
                Email
              </th>

              <th className="text-left p-5">
                National ID
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Action
              </th>

            </tr>
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

                  <td className="p-4">{item.fullName}</td>

                  <td className="p-4">{item.documentId}</td>

<<<<<<< HEAD
                  <td className="p-4">{item.email}</td>

                  <td className="p-4 text-yellow-400 font-medium capitalize">
                    {item.verificationStatus}
                  </td>

                  <td className="p-4">
                    {actionLoading === item._id ? (
                      <span className="text-gray-400 text-sm">Processing...</span>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
=======
            {
              loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400"
                  >

                    Loading...

                  </td>

                </tr>

              ) : identities.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400"
                  >

                    No pending identities

                  </td>

                </tr>

              ) : (

                identities.map((identity) => (

                  <tr
                    key={identity._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >

                    {/* FULL NAME */}

                    <td className="p-5 font-medium">

                      {identity.fullName}

                    </td>

                    {/* EMAIL */}

                    <td className="p-5 text-gray-300">

                      {identity.email}

                    </td>

                    {/* NATIONAL ID */}

                    <td className="p-5">

                      {identity.documentId}

                    </td>

                    {/* STATUS */}

                    <td className="p-5">

                      <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl text-sm">

                        {identity.status}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-5 flex gap-3">

                      <button
                        onClick={() =>
                          handleApprove(identity._id)
                        }
                        className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-xl font-medium"
                      >

                        Approve

                      </button>

                      <button
                        onClick={() =>
                          handleReject(identity._id)
                        }
                        className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl font-medium"
                      >

                        Reject

                      </button>

                    </td>

                  </tr>

                ))
              )
            }

          </tbody>

        </table>
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

      </div>

    </div>
  );
}